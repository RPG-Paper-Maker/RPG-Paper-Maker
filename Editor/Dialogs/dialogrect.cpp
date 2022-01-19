/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogrect.h"
#include "ui_dialogrect.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogRect::DialogRect(QRectF *rect, bool controlSquare, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogRect),
    m_rect(rect),
    m_controlSquare(controlSquare)
{
    ui->setupUi(this);
    
    if (m_controlSquare) {
        int squareSize = RPM::get()->getSquareSize();
        int two = getTwo();

        ui->spinBoxX->setMinimum(0);
        ui->spinBoxX->setMaximum(squareSize - two);
        ui->spinBoxX->setValue(translateToSpinValue(m_rect->x()));

        ui->spinBoxY->setMinimum(0);
        ui->spinBoxY->setMaximum(squareSize - two);
        ui->spinBoxY->setValue(translateToSpinValue(m_rect->y()));

        ui->spinBoxWidth->setMinimum(two);
        ui->spinBoxWidth->setMaximum(squareSize);
        ui->spinBoxWidth->setValue(translateToSpinValue(m_rect->width()));

        ui->spinBoxHeight->setMinimum(two);
        ui->spinBoxHeight->setMaximum(squareSize);
        ui->spinBoxHeight->setValue(translateToSpinValue(m_rect->height()));
    } else {
        ui->spinBoxWidth->setValue(static_cast<int>(rect->width()));
        ui->spinBoxHeight->setValue(static_cast<int>(rect->height()));
        ui->spinBoxX->setValue(static_cast<int>(rect->x()));
        ui->spinBoxY->setValue(static_cast<int>(rect->y()));
    }

    this->translate();
}

DialogRect::~DialogRect()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogRect::updateValues() {
    if (this->parent() != nullptr) {
        reinterpret_cast<QWidget *>(this->parent())->repaint();
    }
}

// -------------------------------------------------------

int DialogRect::translateToSpinValue(float percent) {
    return qRound((percent / 100.0f) * RPM::get()->getSquareSize());
}

// -------------------------------------------------------

float DialogRect::translateFromSpinValue(int px) {
    return (px / (float) RPM::get()->getSquareSize()) * 100.0f;
}

// -------------------------------------------------------

int DialogRect::getOne() {
    return RPM::coefSquareSize() * 1;
}

// -------------------------------------------------------

int DialogRect::getTwo() {
    return RPM::coefSquareSize() * 2;
}

//-------------------------------------------------

void DialogRect::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SELECT_RECT) + RPM
        ::DOT_DOT_DOT);
    ui->labelX->setText(RPM::translate(Translations::X) + RPM::COLON);
    ui->labelY->setText(RPM::translate(Translations::Y) + RPM::COLON);
    ui->labelXpx->setText(RPM::translate(Translations::PX));
    ui->labelYpx->setText(RPM::translate(Translations::PX));
    ui->labelWidth->setText(RPM::translate(Translations::WIDTH) + RPM::COLON);
    ui->labelHeight->setText(RPM::translate(Translations::HEIGHT) + RPM::COLON);
    ui->labelWidthpx->setText(RPM::translate(Translations::PX));
    ui->labelHeightpx->setText(RPM::translate(Translations::PX));
    ui->pushButtonClose->setText(RPM::translate(Translations::CLOSE));
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogRect::on_spinBoxX_valueChanged(int i) {
    if (m_controlSquare) {
        m_rect->setX(translateFromSpinValue(i));
        if (translateToSpinValue(m_rect->width()) == getOne()) {
            m_rect->setWidth(translateFromSpinValue(getTwo()));
            ui->spinBoxWidth->setValue(getTwo());
        }
        else
            ui->spinBoxWidth->setValue(translateToSpinValue(m_rect->width()));
    } else {
        m_rect->setX(i);
        m_rect->setWidth(ui->spinBoxWidth->value());
    }

    updateValues();
}

// -------------------------------------------------------

void DialogRect::on_spinBoxY_valueChanged(int i) {
    if (m_controlSquare) {
        m_rect->setY(translateFromSpinValue(i));
        if (translateToSpinValue(m_rect->height()) == getOne()) {
            m_rect->setHeight(translateFromSpinValue(getTwo()));
            ui->spinBoxHeight->setValue(getTwo());
        }
        else
            ui->spinBoxHeight->setValue(translateToSpinValue(m_rect->height()));
    } else {
        m_rect->setY(i);
        m_rect->setHeight(ui->spinBoxHeight->value());
    }

    updateValues();
}

// -------------------------------------------------------

void DialogRect::on_spinBoxWidth_valueChanged(int i) {
    if (m_controlSquare) {
        m_rect->setWidth(translateFromSpinValue(i));
        if (m_rect->right() >= 100) {
            m_rect->setRight(translateFromSpinValue(
                                 RPM::get()->project()->gameDatas()->systemDatas()
                                 ->squareSize()));
            ui->spinBoxX->setValue(RPM::get()->project()->gameDatas()
                                   ->systemDatas()->squareSize() - i);
        }
    } else {
        m_rect->setWidth(i);
    }

    updateValues();
}

// -------------------------------------------------------

void DialogRect::on_spinBoxHeight_valueChanged(int i) {
    if (m_controlSquare) {
        m_rect->setHeight(translateFromSpinValue(i));
        if (m_rect->bottom() >= 100) {
            m_rect->setBottom(translateFromSpinValue(
                                 RPM::get()->project()->gameDatas()->systemDatas()
                                 ->squareSize()));
            ui->spinBoxY->setValue(RPM::get()->project()->gameDatas()
                                   ->systemDatas()->squareSize() - i);
        }
    } else {
        m_rect->setHeight(i);
    }

    updateValues();
}
