/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

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

    this->translate();
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

void DialogExport::translate() {
    this->setWindowTitle(RPM::translate(Translations::EXPORT_STANDALONE));
    ui->labelMajor->setText(RPM::translate(Translations::MAJOR) + RPM::COLON);
    ui->labelMinor->setText(RPM::translate(Translations::MINOR) + RPM::COLON);
    ui->labelDeployOS->setText(RPM::translate(Translations::OS) + RPM::COLON);
    ui->labelLocation->setText(RPM::translate(Translations::LOCATION) + RPM
        ::COLON);
    ui->checkBoxProtect->setText(RPM::translate(Translations::PROTECT_DATAS));
    ui->radioButtonBrowser->setText(RPM::translate(Translations::DEPLOY_WEB));
    ui->radioButtonDesktop->setText(RPM::translate(Translations::DEPLOY_DESKTOP));
    ui->groupBoxVersion->setTitle(RPM::translate(Translations::VERSION));
    ui->groupBoxTypeOfExport->setTitle(RPM::translate(Translations::TYPE_EXPORT));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

//-------------------------------------------------
//
//  SLOTS
//
//-------------------------------------------------

void DialogExport::on_pushButtonLocation_clicked()
{
    QString dir;

    dir = QFileDialog::getExistingDirectory(this, RPM::translate(Translations
        ::SELECT_A_LOCATION), ui->lineEditLocation->text());
    if (dir.count() > 0) {
        ui->lineEditLocation->setText(dir);
    }
}

// -------------------------------------------------------

void DialogExport::on_comboBoxOSDeploy_currentIndexChanged(int index)
{
    if (index == static_cast<int>(OSKind::Mac)) // If windows and mac
    {
        #if defined(Q_OS_WIN) || defined(Q_OS_LINUX)
            QMessageBox::warning(this, RPM::translate(Translations::WARNING), RPM
                ::translate(Translations::YOU_CANT_EXPORT_MACOS_WINDOWS) + RPM::DOT);
        #endif
        ui->comboBoxOSDeploy->setCurrentIndex(0);
    }
}

// -------------------------------------------------------

void DialogExport::accept()
{
    QString message = nullptr;
    OSKind osKind;
    QString location = ui->lineEditLocation->text();
    if (ui->radioButtonDesktop->isChecked())
    {
        osKind = static_cast<OSKind>(ui->comboBoxOSDeploy->currentIndex());
        message = m_control.createDesktop(location, osKind, ui->checkBoxProtect
            ->isChecked(), ui->spinBoxMajorVersion->value(), ui
            ->spinBoxMinorVersion->value());
    } else if (ui->radioButtonBrowser->isChecked())
    {
        message = m_control.createBrowser(location, ui->spinBoxMajorVersion
            ->value(), ui->spinBoxMinorVersion->value());
    }
    if (message != nullptr)
    {
        if (message != RPM::DASH)
        {
            QMessageBox::critical(this, RPM::translate(Translations::ERROR_MESSAGE),
                message);
        }
    } else
    {
        QDialog::accept();
    }
}

// -------------------------------------------------------

void DialogExport::on_radioButtonDesktop_toggled(bool checked)
{
    ui->labelDeployOS->setEnabled(checked);
    ui->comboBoxOSDeploy->setEnabled(checked);
    ui->checkBoxProtect->setEnabled(checked);
}
