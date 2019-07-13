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

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogLocation::DialogLocation(QString location, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogLocation)
{
    ui->setupUi(this);
    

    ui->lineEdit->setText(location);
    ui->lineEdit->setCursorPosition(0);
}

DialogLocation::~DialogLocation()
{
    delete ui;
}

QString DialogLocation::location() const { return ui->lineEdit->text(); }

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogLocation::on_pushButton_clicked(){
    QString dir = QFileDialog::getExistingDirectory(this,"Select a location",
                                                    location());
    if (dir.count() > 0)
        ui->lineEdit->setText(dir);
}
