/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialoglocation.h"
#include "ui_dialoglocation.h"
#include <QFileDialog>
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogLocation::DialogLocation(QString location, QString autov, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogLocation)
{
    ui->setupUi(this);
    
    ui->lineEdit->setText(location);
    ui->lineEdit->setCursorPosition(0);
    m_auto = autov;
    ui->pushButtonAuto->setVisible(!m_auto.isEmpty());

    this->translate();
}

DialogLocation::~DialogLocation() {
    delete ui;
}

QString DialogLocation::location() const {
    return ui->lineEdit->text();
}

// -------------------------------------------------------

void DialogLocation::translate() {
    this->setWindowTitle(RPM::translate(Translations::CHOOSE_LOCATION) + RPM
        ::DOT_DOT_DOT);
    ui->labelLocation->setText(RPM::translate(Translations::LOCATION) + RPM
        ::COLON);
    ui->pushButtonAuto->setText(RPM::translate(Translations::AUTO));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogLocation::on_pushButton_clicked() {
    QString dir;

    dir = QFileDialog::getExistingDirectory(this, RPM::translate(Translations
        ::SELECT_A_LOCATION), this->location());
    if (dir.count() > 0) {
        ui->lineEdit->setText(dir);
    }
}

// -------------------------------------------------------

void DialogLocation::on_pushButtonAuto_clicked() {
    ui->lineEdit->setText(m_auto);
}
