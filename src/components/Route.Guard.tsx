"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { message } from "antd";
import loginStore from "../store/page";

interface RouteGuardProps {
  children: React.ReactNode;
}

const RouteGuard = ({ children }: RouteGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const publicRoutes = ["/", "/maindashboard", "/login", "/signup"];
    const isPublicRoute = publicRoutes.includes(pathname);
    const isLoggedIn = loginStore.islogin;

    if (!isLoggedIn && !isPublicRoute) {
      messageApi.error("Please login to access this page");
      router.push("/login");
      return;
    }
    if (isLoggedIn && (pathname === "/login" || pathname === "/signup")) {
      router.push("/");
      return;
    }
  }, [pathname, router, messageApi]);

  return (
    <>
      {contextHolder}
      {children}
    </>
  );
};

export default RouteGuard; 
