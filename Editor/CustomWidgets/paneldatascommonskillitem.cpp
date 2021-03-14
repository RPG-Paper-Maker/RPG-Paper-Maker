/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/


#include "paneldatascommonskillitem.h"
#include "ui_paneldatascommonskillitem.h"
#include "rpm.h"
#include "systemeffect.h"
#include "systemcost.h"
#include "systemcharacteristic.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PanelDatasCommonSkillItem::PanelDatasCommonSkillItem(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::PanelDatasCommonSkillItem),
    m_model(nullptr)
{
    ui->setupUi(this);

    this->translate();
}

PanelDatasCommonSkillItem::~PanelDatasCommonSkillItem()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void PanelDatasCommonSkillItem::initialize(CommonSkillItemKind kind) {
    m_kind = kind;

    // Retain size when hidden (because of widget icon having weird behaviors)
    QSizePolicy sp_retain;
    QList<QWidget *> widgetList;
    widgetList << ui->labelType << ui->comboBoxType << ui->checkBoxOneHand;
    for (int i = 0; i < widgetList.size(); i++) {
        sp_retain = widgetList[i]->sizePolicy();
        sp_retain.setRetainSizeWhenHidden(true);
        widgetList[i]->setSizePolicy(sp_retain);
    }
    ui->panelPrimitiveValueConditions->addNone();
    ui->panelPrimitiveValueConditions->initializeMessage(true);
    ui->treeViewPrice->initializeNewItemInstance(new SystemCost(DamagesKind
        ::Currency, new PrimitiveValue(PrimitiveValueKind::DataBase, 1), new
        PrimitiveValue(PrimitiveValueKind::DataBase, 1), 1, new PrimitiveValue(
        QString("1"))));
    ui->treeViewCost->initializeNewItemInstance(new SystemCost);
    ui->treeViewEffects->initializeNewItemInstance(new SystemEffect);
    ui->treeViewCharacteristics->initializeNewItemInstance(new SystemCharacteristic);
    ui->comboBoxTarget->addItems(RPM::ENUM_TO_STRING_TARGET_KIND);
    ui->comboBoxAvailable->addItems(RPM::ENUM_TO_STRING_AVAILABLE_KIND);

    switch (m_kind) {
    case CommonSkillItemKind::Skill:
        initializeCommonSkill();
        ui->checkBoxOneHand->hide();
        ui->groupBoxCharacteristics->hide();
        ui->labelType->hide();
        ui->comboBoxType->hide();
        ui->checkBoxConsumable->hide();
        ui->groupBoxPrice->hide();
        break;
    case CommonSkillItemKind::Item:
        initializeCommonSkill();

        ui->checkBoxOneHand->hide();
        ui->groupBoxCharacteristics->hide();
        ui->groupBoxCosts->hide();
        SuperListItem::fillComboBox(ui->comboBoxType, getTypeModel());
        break;
    case CommonSkillItemKind::Armor:
        ui->checkBoxConsumable->hide();
        ui->checkBoxOneHand->hide();
        ui->groupBoxCosts->hide();
        ui->groupBoxEffects->hide();
        ui->labelTarget->hide();
        ui->comboBoxTarget->hide();
        ui->labelTargetConditions->hide();
        ui->panelPrimitiveValueTargetConditions->hide();
        ui->labelAvailable->hide();
        ui->comboBoxAvailable->hide();
        ui->labelUserAnimation->hide();
        ui->panelPrimitiveValueAnimationUser->hide();
        ui->labelTargetAnimation->hide();
        ui->panelPrimitiveValueAnimationTarget->hide();
        ui->labelSound->hide();
        ui->widgetSongSound->hide();

        // Initialize widgets
        SuperListItem::fillComboBox(ui->comboBoxType, getTypeModel());
        break;
    case CommonSkillItemKind::Weapon:
        initializeCommonSkill();

        SuperListItem::fillComboBox(ui->comboBoxType, getTypeModel());
        ui->checkBoxConsumable->hide();
        ui->labelAvailable->hide();
        ui->comboBoxAvailable->hide();
        ui->labelSound->hide();
        ui->widgetSongSound->hide();
        break;
    }
}

// -------------------------------------------------------

void PanelDatasCommonSkillItem::update(SystemCommonSkillItem *model) {
    m_model = model;

    QStandardItemModel *itemModel = getTypeModel();

    if (itemModel != nullptr) {
        ui->comboBoxType->setCurrentIndex(SuperListItem::getIndexById(
            getTypeModel()->invisibleRootItem(), m_model->type()));
    }
    ui->checkBoxConsumable->setChecked(m_model->consumable());
    ui->checkBoxOneHand->setChecked(m_model->oneHand());
    ui->widgetIcon->initializeIcon(m_model);
    ui->widgetTextLangDescription->initializeNamesLang(m_model->description());
    ui->panelPrimitiveValueConditions->initializeModel(m_model
        ->conditionFormula());
    ui->panelPrimitiveValueConditions->updateModel();
    ui->comboBoxTarget->setCurrentIndex(static_cast<int>(m_model
        ->targetKind()));
    ui->panelPrimitiveValueTargetConditions->initializeModel(m_model
        ->targetConditionFormula());
    ui->panelPrimitiveValueTargetConditions->updateModel();
    ui->comboBoxAvailable->setCurrentIndex(static_cast<int>(m_model
        ->availableKind()));
    ui->widgetSongSound->initialize(m_model->sound());
    ui->panelPrimitiveValueAnimationUser->initializeModel(m_model
        ->animationUserID());
    ui->panelPrimitiveValueAnimationUser->updateModel();
    ui->panelPrimitiveValueAnimationTarget->initializeModel(m_model
        ->animationTargetID());
    ui->panelPrimitiveValueAnimationTarget->updateModel();
    ui->treeViewPrice->initializeModel(m_model->modelPrice());
    ui->treeViewCost->initializeModel(m_model->modelCosts());
    ui->treeViewEffects->initializeModel(m_model->modelEffects());
    ui->treeViewCharacteristics->initializeModel(m_model->modelCharacteristics());

    updateAllModelsRow();
}

// -------------------------------------------------------

QStandardItemModel* PanelDatasCommonSkillItem::getTypeModel() {
    switch (m_kind) {
    case CommonSkillItemKind::Item:
        return RPM::get()->project()->gameDatas()->systemDatas()
            ->modelItemsTypes();
    case CommonSkillItemKind::Armor:
        return RPM::get()->project()->gameDatas()->battleSystemDatas()
            ->modelArmorsKind();
    case CommonSkillItemKind::Weapon:
        return RPM::get()->project()->gameDatas()->battleSystemDatas()
            ->modelWeaponsKind();
    default:
        return nullptr;
    }
}

// -------------------------------------------------------

void PanelDatasCommonSkillItem::updateAllModelsRow() {
    ui->treeViewPrice->updateAllModelRow();
    ui->treeViewCost->updateAllModelRow();
    ui->treeViewEffects->updateAllModelRow();
    ui->treeViewCharacteristics->updateAllModelRow();
}

// -------------------------------------------------------

void PanelDatasCommonSkillItem::initializeCommonSkill() {
    // Initialize widgets
    ui->panelPrimitiveValueTargetConditions->addNone();
    ui->panelPrimitiveValueTargetConditions->initializeMessage(true);
    ui->panelPrimitiveValueAnimationUser->addNone();
    ui->panelPrimitiveValueAnimationUser->initializeDataBaseCommandId(RPM
        ::get()->project()->gameDatas()->animationsDatas()->model(), nullptr
        , nullptr);
    ui->panelPrimitiveValueAnimationTarget->addNone();
    ui->panelPrimitiveValueAnimationTarget->initializeDataBaseCommandId(RPM
        ::get()->project()->gameDatas()->animationsDatas()->model(), nullptr
        , nullptr);
}

// -------------------------------------------------------

void PanelDatasCommonSkillItem::updateCommonSkill() {
    ui->comboBoxTarget->setCurrentIndex(static_cast<int>(m_model
        ->targetKind()));
    ui->panelPrimitiveValueTargetConditions->initializeModel(m_model
        ->targetConditionFormula());
    ui->panelPrimitiveValueTargetConditions->updateModel();
    ui->comboBoxAvailable->setCurrentIndex(static_cast<int>(m_model
        ->availableKind()));
    ui->panelPrimitiveValueAnimationUser->initializeModel(m_model
        ->animationUserID());
    ui->panelPrimitiveValueAnimationUser->updateModel();
    ui->panelPrimitiveValueAnimationTarget->initializeModel(m_model
        ->animationTargetID());
    ui->panelPrimitiveValueAnimationTarget->updateModel();
}

//-------------------------------------------------

void PanelDatasCommonSkillItem::translate()
{
    ui->labelType->setText(RPM::translate(Translations::TYPE) + RPM::COLON);
    ui->labelSound->setText(RPM::translate(Translations::SOUND_EFFECT) + RPM
        ::SPACE + RPM::PARENTHESIS_LEFT + RPM::translate(Translations::MAIN_MENU) +
        RPM::PARENTHESIS_RIGHT + RPM::COLON);
    ui->labelTarget->setText(RPM::translate(Translations::TARGET) + RPM::COLON);
    ui->labelAvailable->setText(RPM::translate(Translations::AVAILABLE) + RPM
        ::COLON);
    ui->labelConditions->setText(RPM::translate(Translations::CONDITION_FORMULA)
        + RPM::COLON);
    ui->labelDescription->setText(RPM::translate(Translations::DESCRIPTION) +
        RPM::COLON);
    ui->labelUserAnimation->setText(RPM::translate(Translations
        ::USER_ANIMATION_ID) + RPM::COLON);
    ui->labelTargetAnimation->setText(RPM::translate(Translations
        ::TARGET_ANIMATION_ID) + RPM::COLON);
    ui->labelTargetConditions->setText(RPM::translate(Translations
        ::TARGET_CONDITIONS_FORMULA) + RPM::COLON);
    ui->checkBoxConsumable->setText(RPM::translate(Translations::CONSOMABLE));
    ui->checkBoxOneHand->setText(RPM::translate(Translations::ONE_HAND));
    ui->groupBoxPrice->setTitle(RPM::translate(Translations::PRICE));
    ui->groupBoxCosts->setTitle(RPM::translate(Translations::COSTS));
    ui->groupBoxEffects->setTitle(RPM::translate(Translations::EFFECTS));
    ui->groupBoxCharacteristics->setTitle(RPM::translate(Translations
        ::CHARACTERISTICS));
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void PanelDatasCommonSkillItem::on_comboBoxType_currentIndexChanged(int index) {
    if (m_model != nullptr) {
        m_model->setType(SuperListItem::getIdByIndex(getTypeModel(), index));
    }
}

// -------------------------------------------------------

void PanelDatasCommonSkillItem::on_checkBoxConsumable_toggled(bool checked) {
    if (m_model != nullptr) {
        m_model->setConsumable(checked);
    }
}

// -------------------------------------------------------

void PanelDatasCommonSkillItem::on_checkBoxOneHand_toggled(bool checked) {
    if (m_model != nullptr) {
        m_model->setOneHand(checked);
    }
}

// -------------------------------------------------------

void PanelDatasCommonSkillItem::on_comboBoxTarget_currentIndexChanged(int index)
{
    if (m_model != nullptr) {
        m_model->setTargetKind(static_cast<TargetKind>(index));
    }
}

// -------------------------------------------------------

void PanelDatasCommonSkillItem::on_comboBoxAvailable_currentIndexChanged(int
    index)
{
    if (m_model != nullptr) {
        m_model->setAvailableKind(static_cast<AvailableKind>(index));
    }
}
