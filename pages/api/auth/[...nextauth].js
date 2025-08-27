import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import LineProvider from "next-auth/providers/line";
import { login, register } from "@/api/member";
import { salePointLogin } from "@/api/sale_point";

// Helper function to get company config from database
async function getCompanyConfig(companyCode) {
  try {

    let data = {
      'name' : 'main',
      'line_login_client_id' : process.env.LINE_CLIENT_ID,
      'line_login_client_secret': process.env.LINE_CLIENT_SECRET,
    }

    if (!companyCode) {
      return data;
    }

    // This should be your actual API call to get company configuration
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKENDURL}/api/company/${companyCode}/config`);
    if (!response.ok) {
      console.error(`Company config not found for: ${companyCode}`);
      return data;
    }

    return await response.json();

    
  } catch (error) {
    console.error("Error fetching company config:", error);
    return null;
  }
}

// Helper function to extract company from request
function getCompanyFromRequest(req) {
  try {
    // Method 1: From URL query parameter
    const url = new URL(req.url, `http://${req.headers.host}`);
    const companyParam = url.searchParams.get('company');
    if (companyParam) {
      return companyParam;
    }

    // Method 2: From subdomain (company.yourapp.com)
    const host = req.headers.host || '';
    const subdomain = host.split('.')[0];
    if (subdomain && subdomain !== 'www' && subdomain !== 'yourapp') {
      return subdomain;
    }

    // Method 3: From referrer or state
    const referer = req.headers.referer;
    if (referer) {
      const refererUrl = new URL(referer);
      const refererCompany = refererUrl.searchParams.get('company');
      if (refererCompany) {
        return refererCompany;
      }
    }

    return null;
  } catch (error) {
    console.error("Error extracting company from request:", error);
    return null;
  }
}

export default async function auth(req, res) {
  // Get company configuration
  const companyCode = getCompanyFromRequest(req);
  console.log("Company code from request:", companyCode);

  let companyConfig = null;
  if (companyCode) {
    companyConfig = await getCompanyConfig(companyCode);
    if (!companyConfig) {
      console.warn(`Company configuration not found for: ${companyCode}`);
      // You might want to redirect to an error page or use default config
    }
  }

  const authOptions = {
    // 定義身份驗證提供者
    providers: [
      // Credentials login for regular members
      CredentialsProvider({
        id: 'credentials-login',
        name: '一般登入',

        // 授權函數，處理登入邏輯
        async authorize(credentials, req) {

          try {
            const payload = {
              account: credentials.account,
              password: credentials.password,
            };

            // Include company context if available
            if (credentials.company && companyConfig) {
              payload.company_id = companyConfig.id;
              payload.company_code = credentials.company;
            }

            // 向後端發送登入請求
            const res = await login(payload);

            // console.log("login res: ", res);
            // 如果登入成功，返回用戶數據
            if (res.status) {
              return {
                ...res.data,
                company_code: credentials.company || companyCode,
                company_id: companyConfig?.id,
                company_name: companyConfig?.name,
              };
            }
          // 處理無權限的情況
          // if (user.message === "NoPermission") {
          //     return { error: "NoPermission" };
          // }

          // 登入失敗，返回 null
            return null;
          } catch (error) {
            // 無法連接到後台
            console.error("無法連接到後台:", error);
            throw new Error("BackendUnavailable");
          }
        },
      }),

      // Sale point login
      CredentialsProvider({
        // 經銷商登入
        id: 'sale-point-login',
        name: '經銷商登入',
        // 授權函數，處理登入邏輯
        async authorize(credentials, req) {
          try {
            const payload = {
              account: credentials.account,
              password: credentials.password,
            };

            if (credentials.company && companyConfig) {
              payload.company_id = companyConfig.id;
              payload.company_code = credentials.company;
            }

            // 向後端發送登入請求
            const res = await salePointLogin(payload);

            // 如果登入成功，返回用戶數據
            if (res.status) {
              return {
                ...res.data,
                company_code: credentials.company || companyCode,
                company_id: companyConfig?.id,
                company_name: companyConfig?.name,
              };
            }

            // 登入失敗，返回 null
            return null;
          } catch (error) {
            // 無法連接到後台
            console.error("無法連接到後台:", error);
            throw new Error("BackendUnavailable");
          }
        },
      }),

      // Dynamic LINE Login based on company
      ...(companyConfig ? [
        LineProvider({
          id: 'line-login',
          name: `Line登入 - ${companyConfig.name}`,
          clientId: companyConfig.line_login_client_id,
          clientSecret: companyConfig.line_login_client_secret,
          authorization: {
            params: {
              scope: 'profile openid email',
            },
          },
          profile: async (profile, tokens) => {
            try {
              // 呼叫 Line 的 verify API
              const verifyResponse = await fetch('https://api.line.me/oauth2/v2.1/verify', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                  id_token: tokens.id_token,
                  client_id: companyConfig.line_login_client_id,
                }),
              });
              const verifyData = await verifyResponse.json();

              console.log("LINE login verification for company:", companyCode);

              // Check if user exists for this company
              const loginPayload = {
                account: verifyData.sub,
                password: verifyData.sub,
                company_id: companyConfig.id,
                company_code: companyCode,
              };

              //先去後端檢查是否已經有此用戶
              const loginRes = await login(loginPayload);

              if (loginRes.status) {
                console.log("LINE login success for company:", companyCode);
                return {
                  id: loginRes.data.member.user.id,
                  email: loginRes.data.member.user.email,
                  member: loginRes.data.member,
                  access_token: loginRes.data.access_token,
                  company_code: companyCode,
                  company_id: companyConfig.id,
                  company_name: companyConfig.name,
                };
              }

              // User doesn't exist, register new user for this company
              const registerPayload = {
                account: verifyData.sub,
                password: verifyData.sub,
                name: verifyData.name,
                email: verifyData.email ?? "",
                file_name: [verifyData.picture],
                file_org_name: [verifyData.picture],
                file_media_type: ['avatar'],
                file_size: [0],
                line_id: verifyData.sub,
                company_id: companyConfig.id,
                company_code: companyCode,
              };

              console.log("Registering new LINE user for company:", companyCode);
              const newUser = await register(registerPayload);

              if (!newUser.status) {
                console.error("LINE user registration failed:", newUser);
                return null;
              }

              // Login again after registration
              const loginRes2 = await login(loginPayload);
              if (loginRes2.status) {
                return {
                  id: loginRes2.data.member.user.id,
                  email: loginRes2.data.member.user.email,
                  member: loginRes2.data.member,
                  access_token: loginRes2.data.access_token,
                  company_code: companyCode,
                  company_id: companyConfig.id,
                  company_name: companyConfig.name,
                };
              }

              return null;
            } catch (error) {
              console.error("LINE login profile error:", error);
              return null;
            }
          },
        })
      ] : []),
    ],

    secret: process.env.NEXTAUTH_SECRET,

    pages: {
      signIn: companyCode ? `/login?company=${companyCode}` : "/login",
      signOut: ({ provider }) => {
        if (provider === 'sale-point-login') {
          return companyCode ? `/sale_point_login?company=${companyCode}` : '/sale_point_login';
        }
        return companyCode ? `/login?company=${companyCode}` : '/login';
      }
    },

    callbacks: {
      async signIn({ user, account, profile }) {
        if (user?.error === "NoPermission") {
          throw new Error("NoPermission");
        }
        if (user?.error === "BackendUnavailable") {
          throw new Error("BackendUnavailable");
        }
        if (!companyConfig && companyCode) {
          throw new Error("CompanyNotFound");
        }
        return true;
      },

      async jwt({ token, user, trigger, session }) {
        if (user) {
          console.log("JWT callback - user data:", user);

          // Base token data
          const baseToken = {
            userId: user.member?.user?.id || user.user?.id,
            userName: user.member?.user?.name || user.user?.name,
            account: user.member?.user?.account || user.user?.account,
            accessToken: user.access_token,
            companyCode: user.company_code,
            companyId: user.company_id,
            companyName: user.company_name,
            _exp: user._exp,
          };

          // Handle different user types
          if (!user.sale_point_type_id) {
            // Regular member
            return {
              ...token,
              ...baseToken,
              memberId: user.member.id,
              memberName: user.member.name,
              companyId: user.member.company?.id || user.company_id,
              role: 'member',
            };
          } else {
            // Sale point
            return {
              ...token,
              ...baseToken,
              memberId: user.id,
              memberName: user.name,
              companyId: user.company_id,
              role: 'sale_point',
            };
          }
        }

        return token;
      },

      async session({ session, token }) {
        // Include all relevant data in session
        session.user.userId = token.userId;
        session.user.userName = token.userName;
        session.user.account = token.account;
        session.user.accessToken = token.accessToken;
        session.user.memberId = token.memberId;
        session.user.memberName = token.memberName;
        session.user.companyId = token.companyId;
        session.user.companyCode = token.companyCode;
        session.user.companyName = token.companyName;
        session.user.role = token.role;
        session.user._exp = token._exp;

        return session;
      },

      async redirect({ url, baseUrl, token }) {
        const companyCode = token?.companyCode || getCompanyFromRequest({ 
          url, 
          headers: { host: new URL(baseUrl).host } 
        });

        // Redirect to member page
        return `${baseUrl}/member`;
      },
    },

    session: {
      jwt: true,
    },

    debug: process.env.NODE_ENV === 'development',
  };

  return NextAuth(authOptions)(req, res);
}