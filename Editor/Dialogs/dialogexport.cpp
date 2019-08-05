/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogexport.h"
#include "ui_dialogexport.h"
#include "rpm.h"
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
    
    ui->lineEditLocation->setText(RPM::PATH_GAMES);
    ui->lineEditLocation->setCursorPosition(0);
    ui->spinBoxMajorVersion->setValue(project->gameDatas()->systemDatas()
        ->lastMajorVersion());
    ui->spinBoxMinorVersion->setValue(project->gameDatas()->systemDatas()
        ->lastMinorVersion());
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
    QString message = nullptr;
    OSKind osKind;
    QString location = ui->lineEditLocation->text();

    if (ui->radioButtonDesktop->isChecked()){
        osKind = static_cast<OSKind>(ui->comboBoxOSDeploy->currentIndex());
        message = m_control.createDesktop(location, osKind, ui->checkBoxProtect
            ->isChecked(), ui->spinBoxMajorVersion->value(), ui
            ->spinBoxMinorVersion->value());
    }
    else if (ui->radioButtonBrowser->isChecked()){
        message = m_control.createBrowser(location);
    }

    if (message != nullptr) {
        if (message != "-") {
            QMessageBox::critical(this, "Error", message);
        }
    } else {
        QDialog::accept();
    }
}

// -------------------------------------------------------

void DialogExport::on_radioButtonDesktop_toggled(bool checked){
    ui->labelDeployOS->setEnabled(checked);
    ui->comboBoxOSDeploy->setEnabled(checked);
}
