import { FC } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Flex, Input, Text, Heading, Button, Textarea } from '@chakra-ui/react';
import { Toaster, toaster } from './ui/toaster';
import { IReview, TReview } from '../types/review';
import { scrollBarStyles } from '../../utils/scrollBarStyles';

interface AddReviewFormProps {
  getReviewsAndWriteToState: () => void;
}

const fields = [
  { lab: 'Рейтинг', val: 'rating' },
  { lab: 'Текст комментария', val: 'textComment' },
  { lab: 'Идентификатор игры', val: 'gameId' },
  { lab: 'Идентификатор пользователя', val: 'consumerId' },
];

export const AddReviewForm: FC<AddReviewFormProps> = ({
  getReviewsAndWriteToState,
}) => {
  const { register, handleSubmit, reset } = useForm<IReview>();

  const onSubmit: SubmitHandler<IReview> = async (data) => {
    let res;
    if (
      !Number.isNaN(Number(data.gameId)) &&
      !Number.isNaN(Number(data.consumerId))
    ) {
      res = await window.api.addReview({
        rating: data.rating,
        textComment: data.textComment,
        gameId: Number(data.gameId),
        consumerId: Number(data.consumerId),
      });
    } else {
      res = null;
    }

    if (res) {
      toaster.create({
        description: 'Отзыв успешно добавлен',
        type: 'success',
      });
    } else {
      toaster.create({
        description: 'Отзыв не добавлен',
        type: 'error',
      });
    }

    reset();
    getReviewsAndWriteToState();
  };

  const renderFieldEntrail = (field: string) => {
    if (field === 'textComment')
      return (
        <Textarea
          {...register(field, { required: true })}
          {...{
            variant: 'subtle',
            css: { width: 250, height: 250, ...scrollBarStyles },
          }}
        />
      );
    return (
      <Input
        {...register(field as TReview, { required: true })}
        {...{
          variant: 'subtle',
          css: { width: 250 },
        }}
      />
    );
  };

  const renderFields = () => {
    return fields.map((field) => (
      <Flex
        key={field.val}
        alignItems={'center'}
        justifyContent={'space-between'}
        css={{ width: 500 }}
      >
        <Text>{field.lab}</Text>
        {renderFieldEntrail(field.val)}
      </Flex>
    ));
  };

  return (
    <>
      <Toaster />
      <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '20px' }}>
        <Flex direction={'column'} gap={5}>
          <Heading css={{ mb: 5 }}>Свойства</Heading>
          {renderFields()}
          <Button type="submit" css={{ width: 200, ml: '250px', mt: 5 }}>
            Добавить
          </Button>
        </Flex>
      </form>
    </>
  );
};
