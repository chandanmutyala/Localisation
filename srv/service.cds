using {com.cy.localisation as local} from '../db/db';



service LocalisationService {
    entity ScopeItems as projection on local.ScopeItems;
    entity MissingScopeItems as projection on local.MissingScopeItems;
    entity DropdownValues as projection on local.DropdownValues;
}