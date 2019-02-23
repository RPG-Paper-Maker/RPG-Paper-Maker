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
        ui->labelType, ui->comboBoxType, ui->checkBoxConsomable,
        ui->checkBoxOneHand
    });
    for (int i = 0; i < widgetList.size(); i++) {
        sp_retain = widgetList[i]->sizePolicy();
        sp_retain.setRetainSizeWhenHidden(true);
        widgetList[i]->setSizePolicy(sp_retain);
    }

    switch (m_kind) {
    case CommonSkillItemKind::Skill:
        // Hide useless parameters
        ui->labelType->hide();
        ui->comboBoxType->hide();
        ui->checkBoxConsomable->hide();
        ui->checkBoxOneHand->hide();
        ui->labelPrice->hide();
        ui->panelPrimitiveValuePrice->hide();
        ui->groupBoxCaracteristics->hide();

        // Initialize widgets
        ui->panelPrimitiveValueConditions->addNone();
        ui->panelPrimitiveValueConditions->initializeMessage();
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

    switch (m_kind) {
    case CommonSkillItemKind::Skill:
        ui->comboBoxTarget->setCurrentIndex(static_cast<int>(m_model
            ->targetKind()));
        ui->panelPrimitiveValueConditions->initializeModel(m_model
            ->conditionFormula());
        ui->panelPrimitiveValueConditions->updateModel();
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
        ui->widgetSongSound->initialize(m_model->sound());
        break;
    default:
        break;
    }
}

// -------------------------------------------------------

QStandardItemModel* PanelDatasCommonSkillItem::getTypeModel() {
    switch (m_kind) {
    default:
        return nullptr;
    }
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void PanelDatasCommonSkillItem::on_comboBoxType_currentIndexChanged(int index) {
    m_model->setType(SuperListItem::getIdByIndex(getTypeModel(), index));
}

// -------------------------------------------------------

void PanelDatasCommonSkillItem::on_checkBoxConsumable_stateChanged(int state) {
    m_model->setConsumable(state == Qt::Checked);
}

// -------------------------------------------------------

void PanelDatasCommonSkillItem::on_checkBoxOneHand_stateChanged(int state) {
    m_model->setOneHand(state == Qt::Checked);
}

// -------------------------------------------------------

void PanelDatasCommonSkillItem::on_comboBoxTarget_currentIndexChanged(int index)
{
    m_model->setTargetKind(static_cast<TargetKind>(index));
}

// -------------------------------------------------------

void PanelDatasCommonSkillItem::on_comboBoxAvailable_currentIndexChanged(int
    index)
{
    m_model->setAvailableKind(static_cast<AvailableKind>(index));
}
