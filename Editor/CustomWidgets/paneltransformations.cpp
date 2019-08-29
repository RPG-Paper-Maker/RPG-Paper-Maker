/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

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
    m_mapElementPosition(nullptr)
{
    ui->setupUi(this);

    this->initialize();
}

PanelTransformations::~PanelTransformations()
{
    delete ui;

    this->deletePosition();
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

AxisKind PanelTransformations::currentAxisKind() const {
    return static_cast<AxisKind>(ui->tabWidget->currentIndex());
}

// -------------------------------------------------------

void PanelTransformations::initialize() {
    this->on_positionSelected(nullptr, true);
    ui->panelSubTransformationX->initializeRotation(AxisKind::X);
    ui->panelSubTransformationY->initializeRotation(AxisKind::Y);
    ui->panelSubTransformationZ->initializeRotation(AxisKind::Z);
    connect(ui->panelSubTransformationX, SIGNAL(positionChanged(Position &)),
        this, SLOT(on_positionChangedUI(Position &)));
    connect(ui->panelSubTransformationY, SIGNAL(positionChanged(Position &)),
        this, SLOT(on_positionChangedUI(Position &)));
    connect(ui->panelSubTransformationZ, SIGNAL(positionChanged(Position &)),
        this, SLOT(on_positionChangedUI(Position &)));
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
        "[NONE]\n\n\n\n" : m_mapElementPosition->toString(RPM::getSquareSize()));
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

    switch (ui->tabWidget->currentIndex()) {
    case 0:
        ui->panelSubTransformationX->updatePositionAuto();
        ui->panelSubTransformationX->updatePositionClick(positive); break;
    case 1:
        ui->panelSubTransformationY->updatePositionAuto();
        ui->panelSubTransformationY->updatePositionClick(positive); break;
    case 2:
        ui->panelSubTransformationZ->updatePositionAuto();
        ui->panelSubTransformationZ->updatePositionClick(positive); break;
    }
}

// -------------------------------------------------------

void PanelTransformations::on_positionChangedUI(Position &previousPosition) {
    this->updateText();

    emit positionChanged(*m_mapElementPosition, previousPosition);
}
