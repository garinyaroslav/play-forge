import { FC } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Flex, Input, Text, Heading, Button } from '@chakra-ui/react';
import { Toaster, toaster } from './ui/toaster';
import { ICartItem, TCartItem } from '../types/cartItem';

interface AddCartItemFormProps {
  getCartItemsAndWriteToState: () => void;
}

const fields = [
  { lab: 'Идентификатор корзины', val: 'cartId' },
  { lab: 'Идентификатор игры', val: 'gameId' },
];

export const AddCartItemForm: FC<AddCartItemFormProps> = ({
  getCartItemsAndWriteToState,
}) => {
  const { register, handleSubmit, reset } = useForm<ICartItem>();

  const onSubmit: SubmitHandler<ICartItem> = async (data) => {
    let res;
    if (
      !Number.isNaN(Number(data.cartId)) &&
      !Number.isNaN(Number(data.gameId))
    ) {
      res = await window.api.addCartItem({
        cartId: Number(data.cartId),
        gameId: Number(data.gameId),
      });
    } else {
      res = null;
    }

    if (res) {
      toaster.create({
        description: 'Элемент корзины добавлен',
        type: 'success',
      });
    } else {
      toaster.create({
        description: 'Элемент корзины не добавлен',
        type: 'error',
      });
    }

    reset();
    getCartItemsAndWriteToState();
  };

  const renderFieldEntrail = (field: string) => {
    return (
      <Input
        {...register(field as TCartItem, { required: true })}
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
        <Text>{field.lab}</Text> {renderFieldEntrail(field.val)}
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
