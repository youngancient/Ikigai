import pigImage from "../assets/images/pig.png";

export const EmptyState = () => {
  return (
    <div className="w-full h-full rounded-inherit flex items-center justify-center flex-col">
      <img className="grayscale" src={pigImage} alt="Pig Image" />
    </div>
  );
};
