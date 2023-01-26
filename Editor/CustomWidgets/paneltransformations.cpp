/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "paneltransformations.h"
#include "ui_paneltransformations.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PanelTransformations::PanelTransformations(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::PanelTransformations),
    m_mapElementPosition(nullptr),
    m_drawKind(DrawKind::Translate)
{
    ui->setupUi(this);
}

PanelTransformations::~PanelTransformations()
{
    this->deletePosition();
    delete ui;
}

Position * PanelTransformations::mapElementPosition() const
{
    return m_mapElementPosition;
}

DrawKind PanelTransformations::drawKind() const
{
    return m_drawKind;
}

void PanelTransformations::setDrawKind(DrawKind drawKind)
{
    m_drawKind = drawKind;
}

bool PanelTransformations::applyLeftRightClick() const
{
    return ui->checkBoxApplyLeftRightClick->isChecked();
}

bool PanelTransformations::bySquare() const
{
    return ui->checkBoxBySquare->isChecked();
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

AxisKind PanelTransformations::currentAxisKind() const
{
    return static_cast<AxisKind>(ui->tabWidget->currentIndex());
}

// -------------------------------------------------------

void PanelTransformations::setBySquare(bool square)
{
    ui->checkBoxBySquare->setChecked(square);
}

// -------------------------------------------------------

void PanelTransformations::initialize(DrawKind drawKind)
{
    m_drawKind = drawKind;
    this->on_positionSelected(nullptr, true);
    ui->panelSubTransformationX->initialize(drawKind, AxisKind::X);
    ui->panelSubTransformationY->initialize(drawKind, AxisKind::Y);
    ui->panelSubTransformationZ->initialize(drawKind, AxisKind::Z);
    connect(ui->panelSubTransformationX, SIGNAL(positionChanged(Position &)),
        this, SLOT(on_positionChangedUI(Position &)));
    connect(ui->panelSubTransformationY, SIGNAL(positionChanged(Position &)),
        this, SLOT(on_positionChangedUI(Position &)));
    connect(ui->panelSubTransformationZ, SIGNAL(positionChanged(Position &)),
        this, SLOT(on_positionChangedUI(Position &)));
    ui->tabWidget->setEnabled(drawKind != DrawKind::Translate || !ui
        ->checkBoxApplyLeftRightClick->isChecked());
    ui->panelSubTransformationX->setEnabled(drawKind != DrawKind::Scale || !ui
        ->checkBoxApplyLeftRightClick->isChecked());
    ui->panelSubTransformationY->setEnabled(drawKind != DrawKind::Scale || !ui
        ->checkBoxApplyLeftRightClick->isChecked());
    ui->panelSubTransformationZ->setEnabled(drawKind != DrawKind::Scale || !ui
        ->checkBoxApplyLeftRightClick->isChecked());
    ui->checkBoxApplyLeftRightClick->setChecked(RPM::get()->engineSettings()
        ->applyLeftRightClick(drawKind));
    ui->checkBoxBySquare->setVisible(drawKind == DrawKind::Translate || drawKind == DrawKind::Scale);
    if (drawKind == DrawKind::Translate || drawKind == DrawKind::Scale)
    {
        ui->checkBoxBySquare->setChecked(RPM::get()->engineSettings()->bySquare(drawKind));
        emit transformationBySquare(ui->checkBoxBySquare->isChecked());
    }
}

// -------------------------------------------------------

void PanelTransformations::deletePosition() {
    if (m_mapElementPosition != nullptr) {
        delete m_mapElementPosition;
        m_mapElementPosition = nullptr;
    }
    this->updateText();
}

// -------------------------------------------------------

void PanelTransformations::updateText() {
    ui->labelSelectedObject->setText(m_mapElementPosition == nullptr ?
        RPM::BRACKET_LEFT + RPM::translate(Translations::NONE).toUpper() + RPM
        ::BRACKET_RIGHT + RPM::NEW_LINE + RPM::NEW_LINE + RPM::NEW_LINE + RPM
        ::NEW_LINE : m_mapElementPosition->toString());
}

//-------------------------------------------------

void PanelTransformations::translate(DrawKind drawKind)
{
    ui->labelSelectedObjectTitle->setText(RPM::BRACKET_LEFT + RPM::translate(
        Translations::SELECTED_OBJECT) + RPM::BRACKET_RIGHT);
    QString title;
    switch (drawKind)
    {
    case DrawKind::Translate:
        title = RPM::translate(Translations::TRANSLATION);
        break;
    case DrawKind::Rotate:
        title = RPM::translate(Translations::ROTATION);
        break;
    case DrawKind::Scale:
        title = RPM::translate(Translations::SCALING);
        break;
    default:
        break;
    }
    ui->labelRotation->setText(title + RPM::COLON);
    ui->tabWidget->setTabText(0, RPM::translate(Translations::X));
    ui->tabWidget->setTabText(1, RPM::translate(Translations::Y));
    ui->tabWidget->setTabText(2, RPM::translate(Translations::Z));
    ui->panelSubTransformationX->translate(drawKind, AxisKind::X);
    ui->panelSubTransformationY->translate(drawKind, AxisKind::Y);
    ui->panelSubTransformationZ->translate(drawKind, AxisKind::Z);
    ui->checkBoxApplyLeftRightClick->setText(RPM::translate(Translations
        ::APPLY_ON_LEFT_RIGHT_CLICK));
    ui->checkBoxBySquare->setText(RPM::translate(Translations::BY_SQUARE));
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void PanelTransformations::on_positionSelected(Position *p, bool positive) {
    this->deletePosition();
    m_mapElementPosition = p;
    ui->panelSubTransformationX->setMapElementPosition(p);
    ui->panelSubTransformationY->setMapElementPosition(p);
    ui->panelSubTransformationZ->setMapElementPosition(p);
    this->updateText();
    switch (ui->tabWidget->currentIndex())
    {
    case 0:
        ui->panelSubTransformationX->updatePositionClick(positive);
        break;
    case 1:
        ui->panelSubTransformationY->updatePositionClick(positive);
        break;
    case 2:
        ui->panelSubTransformationZ->updatePositionClick(positive);
        break;
    }
}

// -------------------------------------------------------

void PanelTransformations::on_positionChangedUI(Position &previousPosition) {
    this->updateText();

    emit positionChanged(*m_mapElementPosition, previousPosition);
}

// -------------------------------------------------------

void PanelTransformations::on_checkBoxApplyLeftRightClick_toggled(bool checked)
{
    ui->tabWidget->setEnabled(m_drawKind != DrawKind::Translate || !checked);
    ui->panelSubTransformationX->setEnabled(m_drawKind != DrawKind::Scale || !ui
        ->checkBoxApplyLeftRightClick->isChecked());
    ui->panelSubTransformationY->setEnabled(m_drawKind != DrawKind::Scale || !ui
        ->checkBoxApplyLeftRightClick->isChecked());
    ui->panelSubTransformationZ->setEnabled(m_drawKind != DrawKind::Scale || !ui
        ->checkBoxApplyLeftRightClick->isChecked());
    RPM::get()->engineSettings()->setApplyLeftRightClick(m_drawKind, checked);
    RPM::get()->engineSettings()->write();

    // If not checked, impossible to select + operation
    ui->panelSubTransformationX->updateApplyLeftRightEnabled(checked);
    ui->panelSubTransformationY->updateApplyLeftRightEnabled(checked);
    ui->panelSubTransformationZ->updateApplyLeftRightEnabled(checked);
}

// -------------------------------------------------------

void PanelTransformations::on_checkBoxBySquare_toggled(bool checked)
{
    RPM::get()->engineSettings()->setBySquare(m_drawKind, checked);
    RPM::get()->engineSettings()->write();
    emit transformationBySquare(checked);
}
