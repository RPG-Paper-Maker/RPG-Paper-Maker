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

#include "dialognewproject.h"
#include "ui_dialognewproject.h"
#include "mainwindow.h"
#include "wanok.h"
#include <QKeyEvent>
#include <QDir>
#include <QFileDialog>
#include <QMessageBox>
#include <QApplication>

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogNewProject::DialogNewProject(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogNewProject)
{
    ui->setupUi(this);
    setFixedSize(geometry().width(), geometry().height());

    ui->lineEditProjectName->setFocus();
    ui->lineEditLocation->setText(Wanok::dirGames);
    ui->lineEditLocation->setCursorPosition(0);
    //setWindowFlags(Qt::Dialog | Qt::CustomizeWindowHint | Qt::WindowTitleHint);
}

DialogNewProject::~DialogNewProject()
{
    delete ui;
}

QString DialogNewProject::getProjectName() const{
    return ui->lineEditProjectName->text();
}

QString DialogNewProject::getDirectoryName() const{
    return ui->lineEditDirectoryName->text();
}
QString DialogNewProject::getLocation() const{
    return ui->lineEditLocation->text();
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogNewProject::filterDirectoryName(const QString & s){
    ui->lineEditDirectoryName->setText(m_control.filterDirectoryName(s));
}

//-------------------------------------------------
//
//  SLOTS
//
//-------------------------------------------------

void DialogNewProject::on_lineEditProjectName_textChanged(const QString & s){

    // If the user wants to have a genrated directory name
    if (ui->checkBoxAutoGenerate->isChecked()){
        filterDirectoryName(s);
    }
}

// -------------------------------------------------------

void DialogNewProject::on_lineEditDirectoryName_editingFinished(){
    filterDirectoryName(ui->lineEditDirectoryName->text());
}

// -------------------------------------------------------

void DialogNewProject::on_pushButtonLocation_clicked(){
    QString dir = QFileDialog::getExistingDirectory(this,"Select a location",
                                                    ui->lineEditLocation
                                                    ->text());
    if (dir.count() > 0) ui->lineEditLocation->setText(dir);
}

// -------------------------------------------------------

void DialogNewProject::accept(){
    QString message = m_control.createNewProject(ui->lineEditDirectoryName
                                                 ->text(),
                                                 ui->lineEditLocation->text());
    if (message != NULL) QMessageBox::critical(this,"Error",message);
    else{
        QDialog::accept();
    }
}
