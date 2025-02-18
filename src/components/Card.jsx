const Card = ({ title, value }) => {
    return (
      <div className="bg-white p-4 shadow rounded-lg">
        <h2 className="text-gray-600">{title}</h2>
        <p className="text-xl font-bold">{value}</p>
      </div>
    );
  };
  
  export default Card;
  