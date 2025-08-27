import useMediaQuery from "@/hooks/useMediaQuery";

export default function usePageSize() {
  // 檢查螢幕是否為大尺寸（寬度 >= 1500px）
  const isLargeScreen = useMediaQuery("(min-width: 1500px)");
  
  // 檢查螢幕是否為中等尺寸（576px <= 寬度 < 1500px）
  const isMediumScreen = useMediaQuery(
    "(min-width: 576px) and (max-width: 1500px)"
  );
  
  // 檢查螢幕是否為移動設備尺寸（寬度 < 576px）
  const isMobileScreen = useMediaQuery("(max-width: 576px)");

  // 根據螢幕尺寸返回相應的頁面大小（可能是每頁顯示的項目數量）
  if (isLargeScreen) {
    return 12; // 大螢幕返回 12
  } else if (isMediumScreen) {
    return 9;  // 中等螢幕返回 9
  } else if (isMobileScreen) {
    return 8;  // 移動設備螢幕返回 8
  } else {
    return 10; // 如果都不符合以上條件，默認返回 10
  }
}