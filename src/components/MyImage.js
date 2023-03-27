import Image from 'next/image';

const SImage = ({src, ...rests}) => {
  return (
    <Image
      src={src}
      {...rests}
    />
  )
}
export default SImage;