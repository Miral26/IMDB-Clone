import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AppDispatch } from '@/features/store';
import { createProducer, updateProducer } from '@/features/producersSlice';
import { Producer } from '@/features/producersSlice';
import { Resolver } from 'react-hook-form';

interface ProducerFormProps {
  producer?: Producer;
  isEdit?: boolean;
}

interface ProducerFormData {
  name: string;
  gender: string;
  dateOfBirth: string;
  bio: string;
}

const schema = yup.object().shape({
  name: yup.string().required('Name is required').trim(),
  gender: yup.string().required('Gender is required'),
  dateOfBirth: yup.string().required('Date of birth is required'),
  bio: yup.string().required('Biography is required').min(10, 'Biography must be at least 10 characters'),
});

export default function ProducerForm({ producer, isEdit = false }: ProducerFormProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProducerFormData>({
    resolver: yupResolver(schema) as Resolver<ProducerFormData>,
    defaultValues: {
      name: producer?.name || '',
      gender: producer?.gender || '',
      dateOfBirth: producer?.dateOfBirth ? new Date(producer.dateOfBirth).toISOString().split('T')[0] : '',
      bio: producer?.bio || '',
    },
  });

  const onSubmit = async (data: ProducerFormData) => {
    try {
      if (isEdit && producer) {
        await dispatch(updateProducer({ id: producer._id, data })).unwrap();
      } else {
        await dispatch(createProducer(data)).unwrap();
      }
      router.push('/producers');
    } catch (error) {
      console.error('Failed to save producer:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 text-black">
      <h1 className="text-3xl font-bold mb-6">{isEdit ? 'Edit Producer' : 'Add New Producer'}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Producer Name
          </label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                id="name"
                className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            )}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-medium">
            Gender
          </label>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                id="gender"
                className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                  errors.gender ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            )}
          />
          {errors.gender && (
            <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium">
            Date of Birth
          </label>
          <Controller
            name="dateOfBirth"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="date"
                id="dateOfBirth"
                className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                  errors.dateOfBirth ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            )}
          />
          {errors.dateOfBirth && (
            <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium">
            Biography
          </label>
          <Controller
            name="bio"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                id="bio"
                rows={4}
                className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                  errors.bio ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            )}
          />
          {errors.bio && (
            <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/producers')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isEdit ? 'Update Producer' : 'Create Producer'}
          </button>
        </div>
      </form>
    </div>
  );
} 