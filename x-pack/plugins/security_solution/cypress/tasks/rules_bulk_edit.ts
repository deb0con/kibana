/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { TIMELINE_SEARCHBOX, EUI_FILTER_SELECT_ITEM } from '../screens/common/controls';

import {
  BULK_ACTIONS_BTN,
  BULK_ACTIONS_PROGRESS_BTN,
  MODAL_CONFIRMATION_TITLE,
  MODAL_CONFIRMATION_BODY,
  TOASTER_BODY,
  RULES_TAGS_FILTER_BTN,
} from '../screens/alerts_detection_rules';

import {
  INDEX_PATTERNS_RULE_BULK_MENU_ITEM,
  ADD_INDEX_PATTERNS_RULE_BULK_MENU_ITEM,
  DELETE_INDEX_PATTERNS_RULE_BULK_MENU_ITEM,
  TAGS_RULE_BULK_MENU_ITEM,
  ADD_TAGS_RULE_BULK_MENU_ITEM,
  DELETE_TAGS_RULE_BULK_MENU_ITEM,
  RULES_BULK_EDIT_FORM_TITLE,
  RULES_BULK_EDIT_INDEX_PATTERNS,
  RULES_BULK_EDIT_TAGS,
  RULES_BULK_EDIT_FORM_CONFIRM_BTN,
  APPLY_TIMELINE_RULE_BULK_MENU_ITEM,
  RULES_BULK_EDIT_OVERWRITE_TAGS_CHECKBOX,
  RULES_BULK_EDIT_OVERWRITE_INDEX_PATTERNS_CHECKBOX,
  RULES_BULK_EDIT_TIMELINE_TEMPLATES_SELECTOR,
} from '../screens/rules_bulk_edit';

export const clickApplyTimelineTemplatesMenuItem = () => {
  cy.get(BULK_ACTIONS_BTN).click();
  cy.get(APPLY_TIMELINE_RULE_BULK_MENU_ITEM).click().should('not.exist');
};

export const clickIndexPatternsMenuItem = () => {
  cy.get(BULK_ACTIONS_BTN).click();
  cy.get(INDEX_PATTERNS_RULE_BULK_MENU_ITEM).click().should('not.exist');
};

export const clickTagsMenuItem = () => {
  cy.get(BULK_ACTIONS_BTN).click();
  cy.get(TAGS_RULE_BULK_MENU_ITEM).click();
};

export const clickAddTagsMenuItem = () => {
  clickTagsMenuItem();
  cy.get(ADD_TAGS_RULE_BULK_MENU_ITEM).click();
};

export const clickAddIndexPatternsMenuItem = () => {
  clickIndexPatternsMenuItem();
  cy.get(ADD_INDEX_PATTERNS_RULE_BULK_MENU_ITEM).click();
};

export const clickDeleteIndexPatternsMenuItem = () => {
  clickIndexPatternsMenuItem();
  cy.get(DELETE_INDEX_PATTERNS_RULE_BULK_MENU_ITEM).click().should('not.exist');
};

export const openBulkEditAddIndexPatternsForm = () => {
  clickAddIndexPatternsMenuItem();

  cy.get(RULES_BULK_EDIT_FORM_TITLE).should('have.text', 'Add index patterns');
};

export const openBulkEditDeleteIndexPatternsForm = () => {
  cy.get(BULK_ACTIONS_BTN).click();
  cy.get(INDEX_PATTERNS_RULE_BULK_MENU_ITEM).click();
  cy.get(DELETE_INDEX_PATTERNS_RULE_BULK_MENU_ITEM).click();

  cy.get(RULES_BULK_EDIT_FORM_TITLE).should('have.text', 'Delete index patterns');
};

export const openBulkEditAddTagsForm = () => {
  clickAddTagsMenuItem();

  cy.get(RULES_BULK_EDIT_FORM_TITLE).should('have.text', 'Add tags');
};

export const openBulkEditDeleteTagsForm = () => {
  clickTagsMenuItem();
  cy.get(DELETE_TAGS_RULE_BULK_MENU_ITEM).click();

  cy.get(RULES_BULK_EDIT_FORM_TITLE).should('have.text', 'Delete tags');
};

export const openBulkActionsMenu = () => {
  cy.get(BULK_ACTIONS_BTN).click();
};

export const typeIndexPatterns = (indices: string[]) => {
  cy.get(RULES_BULK_EDIT_INDEX_PATTERNS).find('input').type(indices.join('{enter}'));
};

export const typeTags = (tags: string[]) => {
  cy.get(RULES_BULK_EDIT_TAGS).find('input').type(tags.join('{enter}'));
};

export const openTagsSelect = () => {
  cy.get(RULES_BULK_EDIT_TAGS).find('input').click();
};

export const submitBulkEditForm = () => cy.get(RULES_BULK_EDIT_FORM_CONFIRM_BTN).click();

export const waitForBulkEditActionToFinish = ({ rulesCount }: { rulesCount: number }) => {
  cy.get(BULK_ACTIONS_PROGRESS_BTN).should('be.disabled');
  cy.contains(TOASTER_BODY, `You've successfully updated ${rulesCount} rule`);
};

export const checkPrebuiltRulesCannotBeModified = (rulesCount: number) => {
  cy.get(MODAL_CONFIRMATION_BODY).contains(
    `${rulesCount} prebuilt Elastic rules (editing prebuilt rules is not supported)`
  );
};

export const checkMachineLearningRulesCannotBeModified = (rulesCount: number) => {
  cy.get(MODAL_CONFIRMATION_BODY).contains(
    `${rulesCount} custom machine learning rule (these rules don't have index patterns)`
  );
};

export const waitForMixedRulesBulkEditModal = (customRulesCount: number) => {
  cy.get(MODAL_CONFIRMATION_TITLE).should(
    'have.text',
    `This action can only be applied to ${customRulesCount} custom rules`
  );
};

export const checkOverwriteTagsCheckbox = () => {
  cy.get(RULES_BULK_EDIT_OVERWRITE_TAGS_CHECKBOX)
    .should('have.text', "Overwrite all selected rules' tags")
    .click()
    .get('input')
    .should('be.checked');
};

export const checkOverwriteIndexPatternsCheckbox = () => {
  cy.get(RULES_BULK_EDIT_OVERWRITE_INDEX_PATTERNS_CHECKBOX)
    .should('have.text', "Overwrite all selected rules' index patterns")
    .click()
    .get('input')
    .should('be.checked');
};

export const selectTimelineTemplate = (timelineTitle: string) => {
  cy.get(RULES_BULK_EDIT_TIMELINE_TEMPLATES_SELECTOR).click();
  cy.get(TIMELINE_SEARCHBOX).type(`${timelineTitle}{enter}`).should('not.exist');
};

/**
 * check if rule tags filter populated with a list of tags
 * @param tags
 */
export const checkTagsInTagsFilter = (tags: string[]) => {
  cy.get(RULES_TAGS_FILTER_BTN).contains(`Tags${tags.length}`).click();

  cy.get(EUI_FILTER_SELECT_ITEM)
    .should('have.length', tags.length)
    .each(($el, index) => {
      cy.wrap($el).should('have.text', tags[index]);
    });
};
