import { FC, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Flex, Input, Text, Heading, Button, Textarea } from '@chakra-ui/react';
import { IGame } from '../types/game';
import { toaster } from './ui/toaster';
import { IReview, TReview } from '../types/review';
import { scrollBarStyles } from '../../utils/scrollBarStyles';

interface ReviewDitailsProps {
  reviewId: number;
  getReviewsAndWriteToState: () => void;
}

const fields = [
  { lab: 'Идентификатор отзыва', val: 'id' },
  { lab: 'Рейтинг', val: 'rating' },
  { lab: 'Текст комментария', val: 'textComment' },
  { lab: 'Идентификатор игры', val: 'gameId' },
  { lab: 'Идентификатор пользователя', val: 'consumerId' },
];

export const ReviewDitails: FC<ReviewDitailsProps> = ({
  reviewId,
  getReviewsAndWriteToState,
}) => {
  const [review, setReview] = useState<null | IGame>(null);
  const [isEdited, setIsEdited] = useState(false);
  const { register, handleSubmit, reset } = useForm<IReview>({
    values: {
      ...review,
    } as IReview,
  });

  const getReview = async () => {
    const data = await window.api.getReview(reviewId).catch(console.error);

    setReview(data[0]);
  };

  const onCancel = async () => {
    await reset();
    getReview();
    getReviewsAndWriteToState();
    setIsEdited(false);
  };

  const onSubmit: SubmitHandler<IReview> = async (data) => {
    let res;
    if (
      !Number.isNaN(Number(data.gameId)) &&
      !Number.isNaN(Number(data.consumerId))
    ) {
      res = await window.api.updateReview({
        id: Number(data.id),
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
        description: 'Отзыв успешно обновлён',
        type: 'success',
      });
    } else {
      toaster.create({
        description: 'Отзыв не был обновлён',
        type: 'error',
      });
    }
    onCancel();
  };

  const renderFieldEntrail = (field: string) => {
    if (field === 'textComment')
      return (
        <Textarea
          {...register(field, { required: true })}
          {...{
            variant: 'subtle',
            disabled: !isEdited,
            css: {
              width: 250,
              height: 250,
              ...scrollBarStyles,
            },
          }}
        />
      );
    return (
      <Input
        {...register(field as TReview)}
        {...{
          variant: 'subtle',
          disabled: !isEdited || field === 'id',
          css: { width: 250 },
        }}
      />
    );
  };

  useEffect(() => {
    getReview();
  }, [reviewId]);

  if (review)
    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ padding: '20px', display: 'flex', gap: '70px' }}
      >
        <Flex direction={'column'} gap={5}>
          <Heading css={{ mb: 5 }}>Свойства</Heading>
          {fields.map((field) => (
            <Flex
              key={field.val}
              alignItems={'center'}
              justifyContent={'space-between'}
              css={{ width: 500 }}
            >
              <Text>{field.lab}</Text>
              {renderFieldEntrail(field.val)}
            </Flex>
          ))}
          <Flex
            mt={5}
            direction={'column'}
            alignItems={'flex-end'}
            justifyContent={'space-between'}
          >
            {isEdited ? (
              <Flex w={'100%'} justifyContent={'space-between'}>
                <Button onClick={onCancel} css={{ width: 200 }}>
                  Отмена
                </Button>
                <Button type="submit" css={{ width: 200 }}>
                  Готово
                </Button>
              </Flex>
            ) : (
              <>
                <Button
                  type="button"
                  onClick={() => setIsEdited(true)}
                  css={{ width: 200 }}
                >
                  Изменить
                </Button>
                <Button hidden type="submit">
                  1
                </Button>
              </>
            )}
          </Flex>
        </Flex>
      </form>
    );
  return null;
};
