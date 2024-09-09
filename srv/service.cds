using {com.cy.localisation as local} from '../db/db';



service LocalisationService {
    entity ScopeItems as projection on local.ScopeItems;
}