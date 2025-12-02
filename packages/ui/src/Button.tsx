import { Pressable, Text } from 'react-native';
import { tv } from 'tailwind-variants';

const buttonVariants = tv({
  slots: {
    button: 'px-6 py-3 rounded-lg active:opacity-80',
    text: 'text-center font-semibold',
  },
  variants: {
    variant: {
      primary: {
        button: 'bg-red-600',
        text: 'text-white',
      },
      secondary: {
        button: 'bg-gray-200',
        text: 'text-gray-900',
      },
    },
    disabled: {
      true: {
        button: 'opacity-50',
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
    disabled: false,
  },
});

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function Button({ title, onPress, variant = 'primary', disabled = false }: ButtonProps) {
  const { button, text } = buttonVariants({ variant, disabled });

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={button()}
    >
      <Text className={text()}>
        {title}
      </Text>
    </Pressable>
  );
}