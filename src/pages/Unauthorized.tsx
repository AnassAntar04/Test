import { UnauthorizedAccess } from "@/components/UnauthorizedAccess";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <UnauthorizedAccess 
      onGoBack={() => navigate(-1)}
      onGoHome={() => navigate('/')}
    />
  );
};

export default Unauthorized;