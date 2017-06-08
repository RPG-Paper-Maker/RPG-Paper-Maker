/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

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

#include "dialogexport.h"
#include "ui_dialogexport.h"
#include "wanok.h"
#include <QFileDialog>
#include <QMessageBox>

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogExport::DialogExport(Project* project, QWidget *parent) :
    QDialog(parent),
    m_control(project),
    ui(new Ui::DialogExport)
{
    ui->setupUi(this);
    setFixedSize(geometry().width(), geometry().height());

    ui->lineEditLocation->setText(Wanok::dirGames);
    ui->lineEditLocation->setCursorPosition(0);
}

DialogExport::~DialogExport()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

//-------------------------------------------------
//
//  SLOTS
//
//-------------------------------------------------

void DialogExport::on_pushButtonLocation_clicked(){
    QString dir = QFileDialog::getExistingDirectory(this,"Select a location",
                                                    ui->lineEditLocation
                                                    ->text());
    if (dir.count() > 0) ui->lineEditLocation->setText(dir);
}

// -------------------------------------------------------

void DialogExport::accept(){
    QString message = NULL;
    OSKind osKind;
    QString location = ui->lineEditLocation->text();

    if (ui->radioButtonDesktop->isChecked()){
        osKind = static_cast<OSKind>(ui->comboBoxOSDeploy->currentIndex());
        message = m_control.createDesktop(location, osKind, ui->checkBoxProtect
                                          ->isChecked());
    }
    else if (ui->radioButtonBrowser->isChecked()){
        message = m_control.createBrowser(location);
    }

    if (message != NULL)
        QMessageBox::critical(this,"Error",message);
    else
        QDialog::accept();
}

// -------------------------------------------------------

void DialogExport::on_radioButtonDesktop_toggled(bool checked){
    ui->labelDeployOS->setEnabled(checked);
    ui->comboBoxOSDeploy->setEnabled(checked);
    ui->checkBoxProtect->setEnabled(checked);
}
