/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QDir>
#include <QFileDialog>
#include <QMessageBox>
#include "dialognewproject.h"
#include "ui_dialognewproject.h"
#include "rpm.h"

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
    ui->lineEditLocation->setText(RPM::PATH_GAMES);
    ui->lineEditLocation->setCursorPosition(0);

    this->translate();
}

DialogNewProject::~DialogNewProject()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

QString DialogNewProject::getProjectName() const
{
    return ui->lineEditProjectName->text();
}

//-------------------------------------------------

QString DialogNewProject::getDirectoryName() const
{
    return ui->lineEditDirectoryName->text();
}

//-------------------------------------------------

QString DialogNewProject::getLocation() const
{
    return ui->lineEditLocation->text();
}

// -------------------------------------------------------

void DialogNewProject::filterDirectoryName(const QString & s)
{
    ui->lineEditDirectoryName->setText(m_control.filterDirectoryName(s));
}

//-------------------------------------------------

void DialogNewProject::translate()
{
    this->setWindowTitle(RPM::translate(Translations::NEW_PROJECT));
    ui->labelProjectName->setText(RPM::translate(Translations::PROJECT_NAME) +
        RPM::COLON);
    ui->labelDirectoryName->setText(RPM::translate(Translations::DIRECTORY_NAME
        + RPM::COLON));
    ui->labelLocation->setText(RPM::translate(Translations::LOCATION + RPM
        ::COLON));
    ui->checkBoxAutoGenerate->setText(RPM::translate(Translations::AUTO_GENERATE));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

//-------------------------------------------------
//
//  SLOTS
//
//-------------------------------------------------

void DialogNewProject::on_lineEditProjectName_textChanged(const QString &s)
{
    // If the user wants to have a genrated directory name
    if (ui->checkBoxAutoGenerate->isChecked())
    {
        this->filterDirectoryName(s);
    }
}

// -------------------------------------------------------

void DialogNewProject::on_lineEditDirectoryName_editingFinished()
{
    this->filterDirectoryName(ui->lineEditDirectoryName->text());
}

// -------------------------------------------------------

void DialogNewProject::on_pushButtonLocation_clicked()
{
    QString dir;

    dir = QFileDialog::getExistingDirectory(this, Translations
        ::SELECT_A_LOCATION, ui->lineEditLocation->text());
    if (dir.count() > 0)
    {
        ui->lineEditLocation->setText(dir);
    }
}

// -------------------------------------------------------

void DialogNewProject::accept()
{
    QString message;

    message = m_control.createNewProject(ui->lineEditProjectName->text(), ui
        ->lineEditDirectoryName->text(), ui->lineEditLocation->text());
    if (message != nullptr)
    {
        QMessageBox::critical(this,"Error",message);
    } else
    {
        QDialog::accept();
    }
}
