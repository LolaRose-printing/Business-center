import Header from '@/components/shared/Header';
import TransformationForm from '@/components/shared/TransformationForm';
import { transformationTypes } from '@/constants';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

type TransformationTypeKey = keyof typeof transformationTypes;

async function getCurrentUserId() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  try {
    const decoded = verifyToken(token) as { userId: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true },
    });

    if (!user) return null;

    return user.id;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

const AddTransformationTypePage = async ({
  params: { type },
}: {
  params: { type: TransformationTypeKey };
}) => {
  const userId = await getCurrentUserId();
  if (!userId) redirect('/sign-in');

  const transformation = transformationTypes[type];
  const user = await prisma.user.findUnique({ where: { id: userId } });

  return (
    <>
      <Header title={transformation.title} subtitle={transformation.subTitle} />

      <section className="mt-10">
        <TransformationForm
          action="Add"
          userId={userId}
          type={transformation.type as TransformationTypeKey}
          creditBalance={user?.creditBalance ?? 0}
          config={transformation.config}
        />
      </section>
    </>
  );
};

export default AddTransformationTypePage;
