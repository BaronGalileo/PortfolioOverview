import { FormProvider, useForm } from "react-hook-form";
import { Home } from "../pages/Home";


export const App = () => {
  
  const methods = useForm({
    mode: "onBlur"
  })

  return(
    <div className="App">
      <FormProvider {...methods}>
        <Home/>
      </FormProvider>
    </div>
  )
}
