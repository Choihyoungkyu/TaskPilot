import { Suspense } from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><p>로딩 중...</p></div>}>
      {children}
    </Suspense>
  );
}
