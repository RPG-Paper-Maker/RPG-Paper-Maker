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

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PanelTransformations::PanelTransformations(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::PanelTransformations)
{
    ui->setupUi(this);

    this->initialize();
}

PanelTransformations::~PanelTransformations()
{
    delete ui;
}

void PanelTransformations::setMapElementPosition(Position *p) {
    m_mapElementPosition = p;

    ui->panelSubTransformationX->setMapElementPosition(p);
    ui->panelSubTransformationY->setMapElementPosition(p);
    ui->panelSubTransformationZ->setMapElementPosition(p);
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
    ui->panelSubTransformationX->initializeRotation(AxisKind::X);
    ui->panelSubTransformationY->initializeRotation(AxisKind::Y);
    ui->panelSubTransformationZ->initializeRotation(AxisKind::Z);
}
