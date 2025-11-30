'use client';

export default function AuthLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
    <div style={{
      // height: '91vh',
      background: '#EEEEEE',
      margin: 0,
      padding: 0,
      overflow: 'hidden'
    }}>
      {children}
    </div>
  );
}
