import Header from '@/components/shared/Header';
import TransformationForm from '@/components/shared/TransformationForm';
import { transformationTypes } from '@/constants';
import { getUserById } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';

async function getCurrentUserId() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/me`, {
    credentials: 'include',
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.userId;
}

const AddTransformationTypePage = async ({ params: { type } }: SearchParamProps) => {
  const userId = await getCurrentUserId();
  if (!userId) redirect('/sign-in');

  const transformation = transformationTypes[type];
  const user = await getUserById(userId);

  return (
    <>
      <Header
        title={transformation.title}
        subtitle={transformation.subTitle}
      />

      <section className="mt-10">
        <TransformationForm
          action="Add"
          userId={user._id}
          type={transformation.type as TransformationTypeKey}
          creditBalance={user.creditBalance}
        />
      </section>
    </>
  );
};

export default AddTransformationTypePage;
