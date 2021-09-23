/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemeffect.h"
#include "ui_dialogsystemeffect.h"
#include "rpm.h"
#include "common.h"
#include "dialogcommandcallacommonreaction.h"

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
    this->initialize();
    this->translate();
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
    ui->panelPrimitiveValueDamageFormula->initializeMessage(true);
    ui->panelPrimitiveValueDamageFormula->initializeModel(m_effect
        .damagesFormula());
    ui->panelPrimitiveValueDamageFormula->updateModel();
    ui->checkBoxMinimum->setChecked(m_effect.isDamagesMinimum());
    ui->panelPrimitiveMinimum->initializeMessageAndUpdate(m_effect
        .damagesMinimum(), true);
    ui->checkBoxMaximum->setChecked(m_effect.isDamagesMaximum());
    ui->panelPrimitiveMaximum->initializeMessageAndUpdate(m_effect
        .damagesMaximum(), true);
    ui->checkBoxElementID->setChecked(m_effect.isDamageElement());
    ui->panelPrimitiveValueElementID->initializeDataBaseCommandId(m_effect
        .damagesElementID()->modelDataBase());
    ui->panelPrimitiveValueElementID->initializeModel(m_effect
        .damagesElementID());
    ui->panelPrimitiveValueElementID->updateModel();
    ui->checkBoxVariance->setChecked(m_effect.isDamageVariance());
    ui->panelPrimitiveValueVariance->initializeMessage(true);
    ui->panelPrimitiveValueVariance->initializeModel(m_effect
        .damagesVarianceFormula());
    ui->panelPrimitiveValueVariance->updateModel();
    ui->checkBoxCritical->setChecked(m_effect.isDamageCritical());
    ui->panelPrimitiveValueCritical->initializeMessage(true);
    ui->panelPrimitiveValueCritical->initializeModel(m_effect
        .damagesCriticalFormula());
    ui->panelPrimitiveValueCritical->updateModel();
    ui->checkBoxPrecision->setChecked(m_effect.isDamagePrecision());
    ui->panelPrimitiveValuePrecision->initializeMessage(true);
    ui->panelPrimitiveValuePrecision->initializeModel(m_effect
        .damagesPrecisionFormula());
    ui->panelPrimitiveValuePrecision->updateModel();
    ui->checkBoxStockValueIn->setChecked(m_effect.isDamageStockVariable());
    ui->widgetVariableStockValueIn->initializeSuper(m_effect
        .damagesStockVariable());

    // Status
    index = m_effect.isAddStatus() ? 0 : 1;
    ui->comboBoxAddRemoveStatus->addItem(RPM::translate(Translations::ADD));
    ui->comboBoxAddRemoveStatus->addItem(RPM::translate(Translations::REMOVE));
    ui->comboBoxAddRemoveStatus->setCurrentIndex(index);
    ui->panelPrimitiveValueStatusID->initializeDataBaseCommandId(m_effect
        .statusID()->modelDataBase());
    ui->panelPrimitiveValueStatusID->initializeModel(m_effect
        .statusID());
    ui->panelPrimitiveValueStatusID->updateModel();
    ui->panelPrimitiveValueStatusPrecision->initializeMessage(true);
    ui->panelPrimitiveValueStatusPrecision->initializeModel(m_effect
        .statusPrecisionFormula());
    ui->panelPrimitiveValueStatusPrecision->updateModel();

    // Add / Remove skill
    index = m_effect.isAddSkill() ? 0 : 1;
    ui->comboBoxAddRemoveSkill->addItem(RPM::translate(Translations::ADD));
    ui->comboBoxAddRemoveSkill->addItem(RPM::translate(Translations::REMOVE));
    ui->comboBoxAddRemoveSkill->setCurrentIndex(index);
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

    // Special Action
    index = static_cast<int>(m_effect.specialActionKind());
    ui->comboBoxSpecialAction->addItems(RPM
        ::ENUM_TO_STRING_EFFECT_SPECIAL_ACTION_KIND);
    ui->comboBoxSpecialAction->setCurrentIndex(index);

    // Script
    ui->panelPrimitiveValueScript->initializeMessage(true);
    ui->panelPrimitiveValueScript->initializeModel(m_effect
        .scriptFormula());
    ui->panelPrimitiveValueScript->updateModel();

    // Temporarily change target
    ui->checkBoxTemporarilyChangeTarget->setChecked(m_effect
        .isTemporarilyChangeTarget());
    ui->panelPrimitiveValueTemporarilyChangeTarget->initializeMessageAndUpdate(
        m_effect.temporarilyChangeTargetFormula(), true);
}

// -------------------------------------------------------

void DialogSystemEffect::setMinimumEnabled(bool checked) {
    ui->panelPrimitiveMinimum->setEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemEffect::setMaximumEnabled(bool checked) {
    ui->panelPrimitiveMaximum->setEnabled(checked);
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

void DialogSystemEffect::setStockVariableEnabled(bool checked)
{
    ui->widgetVariableStockValueIn->setEnabled(checked);
}

//-------------------------------------------------

void DialogSystemEffect::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SET_EFFECT) + RPM::DOT_DOT_DOT);
    ui->labelWithFormula->setText(RPM::translate(Translations::WITH_FORMULA) + RPM::COLON);
    ui->radioButtonDamages->setText(RPM::translate(Translations::DAMAGES_ON));
    ui->radioButtonSpecialAction->setText(RPM::translate(Translations::SPECIAL_ACTION) + RPM::COLON);
    ui->checkBoxMaximum->setText(RPM::translate(Translations::MAXIMUM) + RPM::COLON);
    ui->checkBoxMinimum->setText(RPM::translate(Translations::MINIMUM) + RPM::COLON);
    ui->checkBoxCritical->setText(RPM::translate(Translations::CRITICAL) + RPM::COLON);
    ui->checkBoxVariance->setText(RPM::translate(Translations::VARIANCE) + RPM::COLON);
    ui->checkBoxElementID->setText(RPM::translate(Translations::ELEMENT_ID) + RPM::COLON);
    ui->checkBoxPrecision->setText(RPM::translate(Translations::PRECISION) + RPM::COLON);
    ui->checkBoxStockValueIn->setText(RPM::translate(Translations::STOCK_VALUE_IN) + RPM::COLON);
    ui->checkBoxTemporarilyChangeTarget->setText(RPM::translate(Translations::TEMPORARILY_CHANGE_TARGET) + RPM::COLON);
    ui->radioButtonStatus->setText(RPM::translate(Translations::STATUS) + RPM::COLON);
    ui->labelWithPrecision->setText(RPM::translate(Translations::WITH_PRECISION).toLower());
    ui->radioButtonCallCommonReaction->setText(RPM::translate(Translations::CALL_A_COMMON_REACTION) + RPM::COLON);
    ui->pushButtonSelect_CallCommonReaction->setText(RPM::translate(Translations::SELECT) + RPM::DOT_DOT_DOT);
    ui->radioButtonAddRemoveSkill->setText(RPM::translate(Translations::SKILL) + RPM::COLON);
    ui->radioButtonPerformSkill->setText(RPM::translate(Translations::PERFORM_SKILL) + RPM::COLON);
    ui->radioButtonScript->setText(RPM::translate(Translations::SCRIPT) + RPM::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
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
    ui->checkBoxMinimum->setEnabled(checked);
    this->setMinimumEnabled(checked ? m_effect.isDamagesMinimum() : false);
    ui->checkBoxMaximum->setEnabled(checked);
    this->setMaximumEnabled(checked ? m_effect.isDamagesMaximum() : false);
    ui->checkBoxElementID->setEnabled(checked);
    this->setElementEnabled(checked ? m_effect.isDamageElement() : false);
    ui->checkBoxVariance->setEnabled(checked);
    this->setVarianceEnabled(checked ? m_effect.isDamageVariance() : false);
    ui->checkBoxCritical->setEnabled(checked);
    this->setCriticalEnabled(checked ? m_effect.isDamageCritical() : false);
    ui->checkBoxPrecision->setEnabled(checked);
    this->setPrecisionEnabled(checked ? m_effect.isDamagePrecision() : false);
    ui->checkBoxStockValueIn->setEnabled(checked);
    this->setStockVariableEnabled(checked ? m_effect.isDamageStockVariable() :
        false);
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
    ui->pushButtonSelect_CallCommonReaction->setEnabled(checked);
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

void DialogSystemEffect::on_checkBoxMinimum_toggled(bool checked) {
    m_effect.setIsDamagesMinimum(checked);

    // Enable
    setMinimumEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemEffect::on_checkBoxMaximum_toggled(bool checked) {
    m_effect.setIsDamagesMaximum(checked);

    // Enable
    setMaximumEnabled(checked);
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

void DialogSystemEffect::on_checkBoxStockValueIn_toggled(bool checked)
{
    m_effect.setIsDamageStockVariable(checked);

    // Enable
    setStockVariableEnabled(checked);
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

// -------------------------------------------------------

void DialogSystemEffect::on_checkBoxTemporarilyChangeTarget_toggled(bool checked)
{
    m_effect.setIsTemporarilyChangeTarget(checked);
    ui->panelPrimitiveValueTemporarilyChangeTarget->setEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemEffect::on_pushButtonSelect_CallCommonReaction_clicked()
{
    DialogCommandCallACommonReaction dialog(m_effect.commonReaction());
    if (dialog.exec() == QDialog::Accepted){
        if (m_effect.commonReaction() != nullptr)
        {
            delete m_effect.commonReaction();
        }
        m_effect.setCommonReaction(dialog.getCommand());
    }
}
