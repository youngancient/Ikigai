import pigImage from "../assets/images/pig.png";

export const EmptyState = ({ text }: { text: string }) => {
  return (
    <div className="w-full h-full rounded-inherit flex items-center justify-center flex-col">
      <img className="grayscale" src={pigImage} alt="Pig Image" />
      <p className="mt-4 text-[16px] font-semibold text-[#F9FBFF] opacity-50">
        {text}
      </p>
    </div>
  );
};
