export class fuelDto{

   
   
    type:String;

    fcblix:number;//Amount of fuel i consumed by the trucks in year x (liter or m3)

    ncv:number; //Average net calorific value of fuel i consumed by the trucks in year x
    
    efco2:number;//CO2 emission factor of fuel i consumed by the trucks in year x (PE - weighted average CO2 emission factor )



   //PE


    coefiy:number;//  CO2 emission coefficient of fuel type i (tCO2/mass or volume unit);

    fcijy:number; // quantity of fuel type i combusted in process j 

    wciy:number; //weighted average mass fraction of carbon in fuel type i

    piy:number; // weighted average density of fuel type i

    

    //electricity
   // ecpjjy:number;//Quantity of electricity consumed by the project electricity consumption source j

    efefjy:number;//Emission factor for electricity generation for source j 

    tdljy:number;//Average technical transmission and distribution losses for providing electricity to source j

    


    
}