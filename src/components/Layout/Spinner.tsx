
interface SpinnerProps {
    msj: string;
  }

  const Spinner: React.FC<SpinnerProps> = ({ msj }) => (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
      <br></br>
      <p className="text-blue-400">{msj}</p>
    </div>
  )
  
  export default Spinner