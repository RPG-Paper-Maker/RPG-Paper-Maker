/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "dialogsystemeffect.h"
#include "ui_dialogsystemeffect.h"
#include "common.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemEffect::DialogSystemEffect(SystemEffect &effect, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemEffect),
    m_effect(effect)
{
    ui->setupUi(this);

    initialize();
}

DialogSystemEffect::~DialogSystemEffect() {
    delete ui;
}

SystemEffect & DialogSystemEffect::effect() const {
    return m_effect;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemEffect::initialize() {
    int index;

    switch(m_effect.kind()) {
    case EffectKind::Damages:
        ui->radioButtonDamages->setChecked(true);
        break;
    case EffectKind::Status:
        ui->radioButtonStatus->setChecked(true);
        break;
    case EffectKind::AddRemoveSkill:
        ui->radioButtonAddRemoveSkill->setChecked(true);
        break;
    case EffectKind::PerformSkill:
        ui->radioButtonPerformSkill->setChecked(true);
        break;
    case EffectKind::CommonReaction:
        ui->radioButtonCallCommonReaction->setChecked(true);
        break;
    case EffectKind::SpecialActions:
        ui->radioButtonSpecialAction->setChecked(true);
        break;
    case EffectKind::Script:
        ui->radioButtonScript->setChecked(true);
        break;
    }

    // Damages
    ui->panelDamagesKind->initialize(m_effect.damagesStatisticID(), m_effect
        .damagesCurrencyID(), m_effect.damagesVariableID(), m_effect
        .damagesKind());
    ui->panelPrimitiveValueDamageFormula->initializeMessage();
    ui->panelPrimitiveValueDamageFormula->initializeModel(m_effect
        .damagesFormula());
    ui->panelPrimitiveValueDamageFormula->updateModel();
    ui->checkBoxElementID->setChecked(m_effect.isDamageElement());
    ui->panelPrimitiveValueElementID->initializeDataBaseCommandId(m_effect
        .damagesElementID()->modelDataBase());
    ui->panelPrimitiveValueElementID->initializeModel(m_effect
        .damagesElementID());
    ui->panelPrimitiveValueElementID->updateModel();
    ui->checkBoxVariance->setChecked(m_effect.isDamageVariance());
    ui->panelPrimitiveValueVariance->initializeMessage();
    ui->panelPrimitiveValueVariance->initializeModel(m_effect
        .damagesVarianceFormula());
    ui->panelPrimitiveValueVariance->updateModel();
    ui->checkBoxCritical->setChecked(m_effect.isDamageCritical());
    ui->panelPrimitiveValueCritical->initializeMessage();
    ui->panelPrimitiveValueCritical->initializeModel(m_effect
        .damagesCriticalFormula());
    ui->panelPrimitiveValueCritical->updateModel();
    ui->checkBoxPrecision->setChecked(m_effect.isDamagePrecision());
    ui->panelPrimitiveValuePrecision->initializeMessage();
    ui->panelPrimitiveValuePrecision->initializeModel(m_effect
        .damagesPrecisionFormula());
    ui->panelPrimitiveValuePrecision->updateModel();

    // Status
    ui->comboBoxAddRemoveStatus->setCurrentIndex(m_effect.isAddStatus() ? 0 : 1);
    ui->panelPrimitiveValueStatusID->initializeDataBaseCommandId(m_effect
        .statusID()->modelDataBase());
    ui->panelPrimitiveValueStatusID->initializeModel(m_effect
        .statusID());
    ui->panelPrimitiveValueStatusID->updateModel();
    ui->panelPrimitiveValueStatusPrecision->initializeMessage();
    ui->panelPrimitiveValueStatusPrecision->initializeModel(m_effect
        .statusPrecisionFormula());
    ui->panelPrimitiveValueStatusPrecision->updateModel();

    // Add / Remove skill
    ui->comboBoxAddRemoveSkill->setCurrentIndex(m_effect.isAddSkill() ? 0 : 1);
    ui->panelPrimitiveValueSkillAdd->initializeDataBaseCommandId(m_effect
        .addSkillID()->modelDataBase());
    ui->panelPrimitiveValueSkillAdd->initializeModel(m_effect
        .addSkillID());
    ui->panelPrimitiveValueSkillAdd->updateModel();

    // Perform skill
    ui->panelPrimitiveValueSkillPerform->initializeDataBaseCommandId(m_effect
        .performSkillID()->modelDataBase());
    ui->panelPrimitiveValueSkillPerform->initializeModel(m_effect
        .performSkillID());
    ui->panelPrimitiveValueSkillPerform->updateModel();

    // Common reaction
    ui->panelPrimitiveValueCommonReaction->initializeDataBaseCommandId(m_effect
        .commonReactionID()->modelDataBase());
    ui->panelPrimitiveValueCommonReaction->initializeModel(m_effect
        .commonReactionID());
    ui->panelPrimitiveValueCommonReaction->updateModel();

    // Special Action
    index = static_cast<int>(m_effect.specialActionKind());
    ui->comboBoxSpecialAction->addItems(Common::enumToStringEffectSpecialActionKind);
    ui->comboBoxSpecialAction->setCurrentIndex(index);

    // Script
    ui->panelPrimitiveValueScript->initializeMessage();
    ui->panelPrimitiveValueScript->initializeModel(m_effect
        .scriptFormula());
    ui->panelPrimitiveValueScript->updateModel();
}

// -------------------------------------------------------

void DialogSystemEffect::setElementEnabled(bool checked) {
    ui->panelPrimitiveValueElementID->setEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemEffect::setVarianceEnabled(bool checked) {
    ui->panelPrimitiveValueVariance->setEnabled(checked);
    ui->labelPercentVariance->setEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemEffect::setCriticalEnabled(bool checked) {
    ui->panelPrimitiveValueCritical->setEnabled(checked);
    ui->labelPercentCritical->setEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemEffect::setPrecisionEnabled(bool checked) {
    ui->panelPrimitiveValuePrecision->setEnabled(checked);
    ui->labelPercentPrecision->setEnabled(checked);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemEffect::on_radioButtonDamages_toggled(bool checked) {
    m_effect.setKind(EffectKind::Damages);

    // Enable
    ui->panelDamagesKind->setEnabled(checked);
    ui->labelWithFormula->setEnabled(checked);
    ui->panelPrimitiveValueDamageFormula->setEnabled(checked);
    ui->checkBoxElementID->setEnabled(checked);
    setPrecisionEnabled(checked ? m_effect.isDamageElement() : false);
    ui->checkBoxVariance->setEnabled(checked);
    setVarianceEnabled(checked ? m_effect.isDamageVariance() : false);
    ui->checkBoxCritical->setEnabled(checked);
    setCriticalEnabled(checked ? m_effect.isDamageCritical() : false);
    ui->checkBoxPrecision->setEnabled(checked);
    setPrecisionEnabled(checked ? m_effect.isDamagePrecision() : false);
}

// -------------------------------------------------------

void DialogSystemEffect::on_radioButtonStatus_toggled(bool checked) {
    m_effect.setKind(EffectKind::Status);

    // Enable
    ui->comboBoxAddRemoveStatus->setEnabled(checked);
    ui->panelPrimitiveValueStatusID->setEnabled(checked);
    ui->labelWithPrecision->setEnabled(checked);
    ui->panelPrimitiveValueStatusPrecision->setEnabled(checked);
    ui->labelPercentStatusPrecision->setEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemEffect::on_radioButtonAddRemoveSkill_toggled(bool checked) {
    m_effect.setKind(EffectKind::AddRemoveSkill);

    // Enable
    ui->comboBoxAddRemoveSkill->setEnabled(checked);
    ui->panelPrimitiveValueSkillAdd->setEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemEffect::on_radioButtonPerformSkill_toggled(bool checked) {
    m_effect.setKind(EffectKind::PerformSkill);

    // Enable
    ui->panelPrimitiveValueSkillPerform->setEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemEffect::on_radioButtonCallCommonReaction_toggled(bool checked) {
    m_effect.setKind(EffectKind::CommonReaction);

    // Enable
    ui->panelPrimitiveValueCommonReaction->setEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemEffect::on_radioButtonSpecialAction_toggled(bool checked) {
    m_effect.setKind(EffectKind::SpecialActions);

    // Enable
    ui->comboBoxSpecialAction->setEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemEffect::on_radioButtonScript_toggled(bool checked) {
    m_effect.setKind(EffectKind::Script);

    // Enable
    ui->panelPrimitiveValueScript->setEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemEffect::on_checkBoxElementID_toggled(bool checked) {
    m_effect.setIsDamageElement(checked);

    // Enable
    setElementEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemEffect::on_checkBoxVariance_toggled(bool checked) {
    m_effect.setIsDamageVariance(checked);

    // Enable
    setVarianceEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemEffect::on_checkBoxCritical_toggled(bool checked) {
    m_effect.setIsDamageCritical(checked);

    // Enable
    setCriticalEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemEffect::on_checkBoxPrecision_toggled(bool checked) {
    m_effect.setIsDamagePrecision(checked);

    // Enable
    setPrecisionEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemEffect::on_comboBoxAddRemoveStatus_currentIndexChanged(int
    index)
{
    m_effect.setIsAddStatus(index == 0);
}

// -------------------------------------------------------

void DialogSystemEffect::on_comboBoxAddRemoveSkill_currentIndexChanged(int
    index)
{
    m_effect.setIsAddSkill(index == 0);
}

// -------------------------------------------------------

void DialogSystemEffect::on_comboBoxSpecialAction_currentIndexChanged(int
    index)
{
    m_effect.setSpecialActionKind(static_cast<EffectSpecialActionKind>(index));
}
