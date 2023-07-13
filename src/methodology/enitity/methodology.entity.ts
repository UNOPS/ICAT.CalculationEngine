import { ApplicabilityEntity } from 'src/master-data/applicability/entity/applicability.entity';
import { Country } from 'src/master-data/country/entity/country.entity';
import { MethodologyData } from 'src/master-data/methodology-data/methodology-data.entity';
import { MitigationActionType } from 'src/master-data/mitigation-action/entity/mitigation-action.entity';
import { Sector } from 'src/master-data/sector/entity/sector.entity';
import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'methodology' })
export class Methodology extends BaseTrackingEntity{
    constructor() {
        super();
        this.createdBy = '-';
        this.editedBy = '-';
      }

   
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  version: string;

  @Column({ default: null })
  name: string;

  @Column({ default: null })
  displayName: string;

  @Column({ default: null })
  developedBy: string;

  @Column({ default: null })
  parentId: number;

  @Column({ default: null })
  applicableSector: string;

  @Column({ default: null })
  Documents: string;

//   @Column({ default: 0 })
//   isActive: number;

  @Column({ default: null })
  easenessOfDataCollection: string;

  @Column({ default: null })
  transportSubSector: string;

  @Column({ default: null })
  upstream_downstream: string;

  @Column({ default: null })
  ghgIncluded: string;
  
  @PrimaryGeneratedColumn("uuid")
  uniqueIdentification:number;

  @ManyToOne((type) => Country, { cascade: false })
  @JoinColumn({ name: 'countryId' })
  country?: Country;

  @ManyToOne((type) => Sector, { cascade: false })
  @JoinColumn({ name: 'sectorId' })
  sector?: Sector;

  @ManyToOne((type) => MitigationActionType, { cascade: false })
  @JoinColumn({ name: 'mitigationActionTypeId' })
  mitigationActionType?: MitigationActionType;

  @ManyToOne((type) => ApplicabilityEntity, { cascade: false })
  @JoinColumn({ name: 'applicabilityId' })
  applicability?: ApplicabilityEntity;

  @ManyToOne((type) => MethodologyData, { cascade: false })
  @JoinColumn({ name: 'methodId' })
  method?: MethodologyData;
}