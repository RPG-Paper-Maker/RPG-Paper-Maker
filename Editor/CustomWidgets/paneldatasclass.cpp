/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QtMath>
#include "paneldatasclass.h"
#include "ui_paneldatasclass.h"
#include "systemstatisticprogression.h"
#include "systemclassskill.h"
#include "systemcharacteristic.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PanelDatasClass::PanelDatasClass(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::PanelDatasClass),
    m_updating(false)
{
    ui->setupUi(this);

    Q_FOREACH(QSpinBox * sp, findChildren<QSpinBox*>()) {
        sp->installEventFilter(this);
    }

    this->translate();
}

PanelDatasClass::~PanelDatasClass()
{
    delete ui;
}

int PanelDatasClass::finalLevel() const {
    return ui->spinBoxClassMaxLevel->value();
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void PanelDatasClass::initialize(bool isClass) {
    ui->treeViewCharacteristic->initializeNewItemInstance(new SystemCharacteristic);
    ui->treeViewStatisticsProgression->initializeNewItemInstance(new
        SystemStatisticProgression);
    ui->treeViewClassSkills->initializeNewItemInstance(new SystemClassSkill);
    ui->tableWidgetTotalLevel->setEditable(false);
    ui->tableWidgetNextLevel->setTotalWidget(ui->tableWidgetTotalLevel);
    if (isClass) {
        ui->tableWidgetNextLevel->setEditedColor(WidgetTableProgression
            ::SUB_EDITED_COLOR);
    }
}

// -------------------------------------------------------

void PanelDatasClass::update(SystemClass *sysClass, SystemClass *originalClass)
{
    m_updating = true;
    m_class = sysClass;
    m_originalClass = originalClass;
    int initialLevel = getInheritValue(sysClass->initialLevel(), originalClass
        ->initialLevel());
    int maxLevel = getInheritValue(sysClass->maxLevel(), originalClass
        ->maxLevel());
    int expBase = getInheritValue(sysClass->expBase(), originalClass->expBase());
    int expInflation = getInheritValue(sysClass->expInflation(), originalClass
        ->expInflation());

    ui->spinBoxClassInitialLevel->setValue(initialLevel);
    ui->spinBoxClassMaxLevel->setValue(maxLevel);
    ui->spinBoxClassBase->setValue(expBase);
    ui->spinBoxClassInflation->setValue(expInflation);
    ui->treeViewCharacteristic->initializeModel(sysClass->characteristics());
    ui->treeViewStatisticsProgression->initializeModel(sysClass
        ->statisticsProgression());
    ui->treeViewStatisticsProgression->header()->setSectionResizeMode(0,
        QHeaderView::Stretch);
    ui->treeViewStatisticsProgression->header()->setSectionResizeMode(1,
        QHeaderView::Interactive);
    ui->treeViewStatisticsProgression->header()->setSectionResizeMode(2,
        QHeaderView::Interactive);
    ui->treeViewClassSkills->initializeModel(sysClass->skills());
    ui->treeViewClassSkills->header()->setSectionResizeMode(0,
        QHeaderView::Stretch);
    ui->treeViewClassSkills->header()->setSectionResizeMode(1,
        QHeaderView::Interactive);
    if (m_class == m_originalClass) {
        ui->pushButtonSetClassValues->setVisible(false);
    } else {
        ui->pushButtonReset->setVisible(false);
    }
    m_updating = false;

    updateExperience();
}

// -------------------------------------------------------

int PanelDatasClass::getInheritValue(int v1, int v2) {
    return v1 == -1 ? v2 : v1;
}

// -------------------------------------------------------

void PanelDatasClass::updateExperience() {
    if (!m_updating) {
        int maxLevel = ui->spinBoxClassMaxLevel->value();
        int expBase = ui->spinBoxClassBase->value();
        int expInflation = ui->spinBoxClassInflation->value();

        ui->tableWidgetNextLevel->setTable(m_class->expTable());
        ui->tableWidgetNextLevel->initialize(maxLevel - 1, RPM::translate(Translations::EXPERIENCE));
        ui->tableWidgetTotalLevel->initialize(maxLevel, RPM::translate(Translations::EXPERIENCE));
        ui->tableWidgetNextLevel->updateWithBaseInflation(expBase, expInflation,
            maxLevel, m_originalClass->expTable());
    }
}

//-------------------------------------------------

void PanelDatasClass::translate()
{
    ui->groupBoxExperience->setTitle(RPM::translate(Translations::EXPERIENCE));
    ui->tabWidget->setTabText(0, RPM::translate(Translations::TO_NEXT_LEVEL));
    ui->tabWidget->setTabText(1, RPM::translate(Translations::TOTAL));
    ui->labelInitialLevel->setText(RPM::translate(Translations::INITIAL_LEVEL) +
        RPM::COLON);
    ui->labelMaxLevel->setText(RPM::translate(Translations::MAX_LEVEL) + RPM
        ::COLON);
    ui->labelBase->setText(RPM::translate(Translations::BASE) + RPM::COLON);
    ui->labelInflation->setText(RPM::translate(Translations::INFLATION) + RPM
        ::COLON);
    ui->groupBoxCharacteristics->setTitle(RPM::translate(Translations
        ::CHARACTERISTICS));
    ui->groupBoxStatisticsProgression->setTitle(RPM::translate(Translations
        ::STATISTICS_PROGRESSION));
    ui->groupBoxSkillsToLearn->setTitle(RPM::translate(Translations
        ::SKILLS_TO_LEARN));
    ui->pushButtonReset->setText(RPM::translate(Translations::RESET));
    ui->pushButtonSetClassValues->setText(RPM::translate(Translations
        ::SET_TO_CLASS_VALUES));
}

// -------------------------------------------------------

bool PanelDatasClass::eventFilter(QObject *o, QEvent *e) {

    if (e->type() == QEvent::Wheel && !reinterpret_cast<QWidget *>(o)->hasFocus())
    {
        e->ignore();
        return true;
    }
    return QWidget::eventFilter(o, e);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void PanelDatasClass::on_spinBoxClassInitialLevel_valueChanged(int i) {
    m_class->setInitialLevel(i, m_originalClass);
    updateExperience();
}

// -------------------------------------------------------

void PanelDatasClass::on_spinBoxClassMaxLevel_valueChanged(int i) {
    m_class->setMaxLevel(i, m_originalClass);
    updateExperience();
    if (!m_updating) {
        emit maxLevelUpdated(i);
    }
}

// -------------------------------------------------------

void PanelDatasClass::on_spinBoxClassBase_valueChanged(int i) {
    m_class->setExpBase(i, m_originalClass);
    updateExperience();
}

// -------------------------------------------------------

void PanelDatasClass::on_spinBoxClassInflation_valueChanged(int i) {
    m_class->setExpInflation(i, m_originalClass);
    updateExperience();
}

// -------------------------------------------------------

void PanelDatasClass::on_pushButtonReset_clicked() {
    m_class->reset();
    m_updating = true;
    ui->spinBoxClassInitialLevel->setValue(m_class->initialLevel());
    ui->spinBoxClassMaxLevel->setValue(m_class->maxLevel());
    ui->spinBoxClassBase->setValue(m_class->expBase());
    ui->spinBoxClassInflation->setValue(m_class->expInflation());
    m_updating = false;
    updateExperience();
}

// -------------------------------------------------------

void PanelDatasClass::on_pushButtonSetClassValues_clicked() {
    m_class->setClassValues();
    m_updating = true;
    ui->spinBoxClassInitialLevel->setValue(m_originalClass->initialLevel());
    ui->spinBoxClassMaxLevel->setValue(m_originalClass->maxLevel());
    ui->spinBoxClassBase->setValue(m_originalClass->expBase());
    ui->spinBoxClassInflation->setValue(m_originalClass->expInflation());
    m_updating = false;
    updateExperience();
}
