import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { token, profileCompleted, email, userRole } = await request.json();

    const cookieStore = await cookies();
    
    const cookieConfig = {
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
    };

    if (token) cookieStore.set('auth-token', token, cookieConfig);
    if (profileCompleted !== undefined) cookieStore.set('profile-completed', String(profileCompleted), cookieConfig);
    if (email) cookieStore.set('user-email', email, cookieConfig);
    if (userRole) cookieStore.set('user-role', userRole, cookieConfig);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('auth-token');
    cookieStore.delete('profile-completed');
    cookieStore.delete('user-email');
    cookieStore.delete('user-role');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
