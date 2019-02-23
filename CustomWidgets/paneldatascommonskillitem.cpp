/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/


#include "paneldatascommonskillitem.h"
#include "ui_paneldatascommonskillitem.h"
#include "rpm.h"

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
    QList<QWidget *> widgetList = QList<QWidget*>({
        ui->labelType, ui->comboBoxType, ui->checkBoxConsumable,
        ui->checkBoxOneHand, ui->groupBoxCosts
    });
    for (int i = 0; i < widgetList.size(); i++) {
        sp_retain = widgetList[i]->sizePolicy();
        sp_retain.setRetainSizeWhenHidden(true);
        widgetList[i]->setSizePolicy(sp_retain);
    }

    ui->panelPrimitiveValueConditions->addNone();
    ui->panelPrimitiveValueConditions->initializeMessage();

    switch (m_kind) {
    case CommonSkillItemKind::Skill:
        initializeCommonSkill();

        ui->labelType->hide();
        ui->comboBoxType->hide();
        ui->checkBoxConsumable->hide();
        ui->labelPrice->hide();
        ui->panelPrimitiveValuePrice->hide();
        break;
    case CommonSkillItemKind::Item:
        initializeCommonSkill();

        ui->groupBoxCosts->hide();
        SuperListItem::fillComboBox(ui->comboBoxType, getTypeModel());
        ui->panelPrimitiveValuePrice->initializeNumberVariable();
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
        ui->panelPrimitiveValuePrice->initializeNumberVariable();
        break;
    default:
        break;
    }
}

// -------------------------------------------------------

void PanelDatasCommonSkillItem::update(SystemCommonSkillItem *model) {
    m_model = model;

    ui->widgetIcon->initializeIcon(m_model);
    ui->widgetTextLangDescription->initializeNamesTrans(m_model->description());
    ui->panelPrimitiveValueConditions->initializeModel(m_model
        ->conditionFormula());
    ui->panelPrimitiveValueConditions->updateModel();

    switch (m_kind) {
    case CommonSkillItemKind::Skill:
        updateCommonSkill();
        break;
    case CommonSkillItemKind::Item:
        updateCommonSkill();
        ui->comboBoxType->setCurrentIndex(SuperListItem::getIndexById(
            getTypeModel()->invisibleRootItem(), m_model->type()));
        ui->checkBoxConsumable->setChecked(m_model->consumable());
        ui->panelPrimitiveValuePrice->initializeModel(m_model->price());
        ui->panelPrimitiveValuePrice->updateModel();
        break;
    case CommonSkillItemKind::Armor:
        ui->panelPrimitiveValuePrice->initializeModel(m_model->price());
        ui->panelPrimitiveValuePrice->updateModel();
        break;
    default:
        break;
    }
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
    default:
        return nullptr;
    }
}

// -------------------------------------------------------

void PanelDatasCommonSkillItem::initializeCommonSkill() {
    // Hide useless parameters
    ui->checkBoxOneHand->hide();
    ui->groupBoxCaracteristics->hide();

    // Initialize widgets
    ui->panelPrimitiveValueTargetConditions->addNone();
    ui->panelPrimitiveValueTargetConditions->initializeMessage();
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
    ui->widgetSongSound->initialize(m_model->sound());
    ui->panelPrimitiveValueAnimationTarget->initializeModel(m_model
        ->animationTargetID());
    ui->panelPrimitiveValueAnimationTarget->updateModel();
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
