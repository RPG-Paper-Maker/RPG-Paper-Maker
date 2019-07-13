/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialognewproject.h"
#include "ui_dialognewproject.h"
#include "mainwindow.h"
#include "rpm.h"
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
    

    ui->lineEditProjectName->setFocus();
    ui->lineEditLocation->setText(RPM::dirGames);
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
    QString message = m_control.createNewProject(ui->lineEditProjectName->text(),
        ui->lineEditDirectoryName->text(), ui->lineEditLocation->text());
    if (message != NULL) QMessageBox::critical(this,"Error",message);
    else{
        QDialog::accept();
    }
}
