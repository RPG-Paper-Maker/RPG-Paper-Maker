/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemmonsteraction.h"
#include "ui_dialogsystemmonsteraction.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemMonsterAction::DialogSystemMonsterAction(SystemMonsterAction &action
    , QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemMonsterAction),
    m_monsterAction(action)
{
    ui->setupUi(this);

    this->initialize();

    this->translate();
}

DialogSystemMonsterAction::~DialogSystemMonsterAction()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemMonsterAction::initialize()
{
    int index;

    connect(ui->panelPrimitiveValuePriority, SIGNAL(numberUpdated(int)), this,
        SLOT(on_priorityUpdated(int)));
    switch (m_monsterAction.actionKind()) {
    case MonsterActionKind::UseItem:
        ui->radioButtonUseItemID->setChecked(true);
        break;
    case MonsterActionKind::UseSkill:
        ui->radioButtonUseSkillID->setChecked(true);
        break;
    case MonsterActionKind::DoNothing:
        ui->radioButtonDoNothing->setChecked(true);
        break;
    }
    ui->panelPrimitiveValueSkillID->initializeDataBaseAndUpdate(m_monsterAction
        .skillID());
    ui->panelPrimitiveValueItemID->initializeDataBaseAndUpdate(m_monsterAction
        .itemID());
    ui->panelPrimitiveValueNumberMax->initializeNumberAndUpdate(m_monsterAction
        .itemNumberMax());
    ui->checkBoxTurnValueIs->setChecked(m_monsterAction.isConditionTurn());
    index = static_cast<int>(m_monsterAction.operationKindTurn());
    ui->comboBoxCompareTurnValueIs->addItems(RPM::ENUM_TO_STRING_OPERATION);
    ui->comboBoxCompareTurnValueIs->setCurrentIndex(index);
    ui->panelPrimitiveValueTurnTo->initializeNumberAndUpdate(m_monsterAction
        .turnValueCompare());
    ui->panelPrimitiveValueStatisticID->initializeDataBaseAndUpdate(
        m_monsterAction.statisticID());
    ui->checkBoxStatisticID->setChecked(m_monsterAction.isConditionStatistic());
    index = static_cast<int>(m_monsterAction.operationKindStatistic());
    ui->comboBoxCompareStatisticID->addItems(RPM::ENUM_TO_STRING_OPERATION);
    ui->comboBoxCompareStatisticID->setCurrentIndex(index);
    ui->panelPrimitiveValueStatisticTo->initializeNumberAndUpdate(
        m_monsterAction.statisticValueCompare());
    ui->widgetVariable->initializeSuper(m_monsterAction.variableID());
    ui->checkBoxVariableValue->setChecked(m_monsterAction.isConditionVariable());
    index = static_cast<int>(m_monsterAction.operationKindVariable());
    ui->comboBoxCompareVariableValue->addItems(RPM::ENUM_TO_STRING_OPERATION);
    ui->comboBoxCompareVariableValue->setCurrentIndex(index);
    ui->panelPrimitiveValueVariableTo->initializeNumberAndUpdate(m_monsterAction
        .variableValueCompare());
    ui->checkBoxIsUnderEffectOfStatus->setChecked(m_monsterAction
        .isConditionStatus());
    ui->panelPrimitiveValueStatusID->initializeDataBaseAndUpdate(m_monsterAction
        .statusID());
    ui->checkBoxScript->setChecked(m_monsterAction.isConditionScript());
    ui->panelPrimitiveValueScript->initializeMessageAndUpdate(m_monsterAction
        .script(), true);
    ui->panelPrimitiveValuePriority->initializeNumberAndUpdate(m_monsterAction
        .priority());
    index = static_cast<int>(m_monsterAction.targetKind());
    ui->comboBoxTarget->addItems(RPM::ENUM_TO_STRING_MONSTER_ACTION_TARGET_KIND);
    ui->comboBoxTarget->setCurrentIndex(index);
}

// -------------------------------------------------------

void DialogSystemMonsterAction::translate() {
    this->setWindowTitle(RPM::translate(Translations::ACTION) + RPM::DOT_DOT_DOT);
    ui->labelTarget->setText(RPM::translate(Translations::TARGET) + RPM::COLON);
    ui->labelPriority->setText(RPM::translate(Translations::PRIORITY) + RPM
        ::COLON);
    ui->labelNumberMax->setText(RPM::translate(Translations::NUMBER_MAX) + RPM
        ::COLON);
    ui->labelProbability->setText(RPM::translate(Translations::PROBABILITY) +
        RPM::COLON);
    ui->labelValueIs_Variable->setText(RPM::translate(Translations::VALUE_IS)
        .toLower());
    ui->labelValueIs_StatisticID->setText(RPM::translate(Translations::VALUE_IS)
        .toLower());
    ui->radioButtonDoNothing->setText(RPM::translate(Translations::DO_NOTHING));
    ui->radioButtonUseItemID->setText(RPM::translate(Translations::USE_ITEM_ID)
        + RPM::COLON);
    ui->radioButtonUseSkillID->setText(RPM::translate(Translations::USE_SKILL_ID
        ) + RPM::COLON);
    ui->checkBoxScript->setText(RPM::translate(Translations::SCRIPT) + RPM
        ::COLON);
    ui->checkBoxStatisticID->setText(RPM::translate(Translations::STATISTIC_ID)
        + RPM::COLON);
    ui->checkBoxTurnValueIs->setText(RPM::translate(Translations::TURN_VALUE_IS));
    ui->checkBoxVariableValue->setText(RPM::translate(Translations::VARIABLE) +
        RPM::COLON);
    ui->checkBoxIsUnderEffectOfStatus->setText(RPM::translate(Translations
        ::IS_UNDER_EFFECT_OF_STATUS_ID) + RPM::COLON);
    ui->groupBoxAction->setTitle(RPM::translate(Translations::ACTION));
    ui->groupBoxConditions->setTitle(RPM::translate(Translations::CONDITIONS));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemMonsterAction::on_radioButtonUseItemID_toggled(bool checked)
{
    if (checked)
    {
        m_monsterAction.setActionKind(MonsterActionKind::UseItem);
    }
    ui->panelPrimitiveValueItemID->setEnabled(checked);
    ui->labelNumberMax->setEnabled(checked);
    ui->panelPrimitiveValueNumberMax->setEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemMonsterAction::on_radioButtonUseSkillID_toggled(bool checked)
{
    if (checked)
    {
        m_monsterAction.setActionKind(MonsterActionKind::UseSkill);
    }
    ui->panelPrimitiveValueSkillID->setEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemMonsterAction::on_radioButtonDoNothing_toggled(bool checked)
{
    if (checked)
    {
        m_monsterAction.setActionKind(MonsterActionKind::DoNothing);
    }
}

// -------------------------------------------------------

void DialogSystemMonsterAction::on_checkBoxScript_toggled(bool checked)
{
    m_monsterAction.setIsConditionScript(checked);
    ui->panelPrimitiveValueScript->setEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemMonsterAction::on_checkBoxStatisticID_toggled(bool checked)
{
    m_monsterAction.setIsConditionStatistic(checked);
    ui->panelPrimitiveValueStatisticID->setEnabled(checked);
    ui->labelValueIs_StatisticID->setEnabled(checked);
    ui->comboBoxCompareStatisticID->setEnabled(checked);
    ui->panelPrimitiveValueStatisticTo->setEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemMonsterAction::on_checkBoxTurnValueIs_toggled(bool checked)
{
    m_monsterAction.setIsConditionTurn(checked);
    ui->comboBoxCompareTurnValueIs->setEnabled(checked);
    ui->panelPrimitiveValueTurnTo->setEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemMonsterAction::on_checkBoxVariableValue_toggled(bool checked)
{
    m_monsterAction.setIsConditionVariable(checked);
    ui->widgetVariable->setEnabled(checked);
    ui->labelValueIs_Variable->setEnabled(checked);
    ui->comboBoxCompareVariableValue->setEnabled(checked);
    ui->panelPrimitiveValueVariableTo->setEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemMonsterAction::on_checkBoxIsUnderEffectOfStatus_toggled(bool
    checked)
{
    m_monsterAction.setIsConditionStatus(checked);
    ui->panelPrimitiveValueStatusID->setEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemMonsterAction::on_comboBoxTarget_currentIndexChanged(int index)
{
    m_monsterAction.setTargetKind(static_cast<MonsterActionTargetKind>(index));
}

// -------------------------------------------------------

void DialogSystemMonsterAction::on_comboBoxCompareTurnValueIs_currentIndexChanged
    (int index)
{
    m_monsterAction.setOperationKindTurn(static_cast<OperationKind>(index));
}

// -------------------------------------------------------

void DialogSystemMonsterAction::on_comboBoxCompareStatisticID_currentIndexChanged
    (int index)
{
    m_monsterAction.setOperationKindStatistic(static_cast<OperationKind>(index));
}

// -------------------------------------------------------

void DialogSystemMonsterAction::on_comboBoxCompareVariableValue_currentIndexChanged
    (int index)
{
    m_monsterAction.setOperationKindVariable(static_cast<OperationKind>(index));
}

// -------------------------------------------------------

void DialogSystemMonsterAction::on_priorityUpdated(int p)
{
    ui->labelPercentProbability->setText(m_monsterAction.probabilityToString(p)
        + "%");
}
