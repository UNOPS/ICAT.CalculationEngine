

export class FeedstockDto{
   type: string;

   /*projectDto*/
   as: number; // Area in which feedstock type s is cultivated for use in the project plant in year y (ha)
   efs: number; //  Default emission factor for the GHG emissions associated with the cultivation of land to produce feedstock type s (tCO2e/ha)
}