/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandplayavideo.h"
#include "ui_dialogcommandplayavideo.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandPlayAVideo::DialogCommandPlayAVideo(EventCommand *command,
    QStandardItemModel *properties, QStandardItemModel *parameters, QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandPlayAVideo),
    m_properties(properties),
    m_parameters(parameters),
    m_videoID(new SuperListItem)
{
    ui->setupUi(this);
    this->initializePrimitives();
    if (command != nullptr)
    {
        this->initialize(command);
    }
    this->translate();
}

DialogCommandPlayAVideo::~DialogCommandPlayAVideo()
{
    delete ui;
    delete m_videoID;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandPlayAVideo::initializePrimitives()
{
    ui->widgetVideo->initialize(m_videoID);
    ui->panelPrimitiveStart->initializeNumber(m_parameters, m_properties, false);
}

// -------------------------------------------------------

void DialogCommandPlayAVideo::translate()
{
    this->setWindowTitle(RPM::translate(Translations::PLAY_A_VIDEO) + RPM
        ::DOT_DOT_DOT);
    ui->labelVideo->setText(RPM::translate(Translations::VIDEO) + RPM::COLON);
    ui->groupBoxOperation->setTitle(RPM::translate(Translations::OPERATION));
    ui->radioButtonPlay->setText(RPM::translate(Translations::PLAY));
    ui->radioButtonPause->setText(RPM::translate(Translations::PAUSE));
    ui->radioButtonStop->setText(RPM::translate(Translations::STOP));
    ui->checkBoxStart->setText(RPM::translate(Translations::START) + RPM::COLON);
    ui->checkBoxWaitEnd->setText(RPM::translate(Translations
        ::WAIT_END_CHANGE_BEFORE_NEXT_COMMAND));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

EventCommand * DialogCommandPlayAVideo::getCommand() const
{
    QVector<QString> command;
    command.append(QString::number(m_videoID->id()));
    if (ui->radioButtonPlay->isChecked())
    {
        command.append("0");
    }
    if (ui->radioButtonPause->isChecked())
    {
        command.append("1");
    }
    if (ui->radioButtonStop->isChecked())
    {
        command.append("2");
    }
    command.append(RPM::boolToString(ui->checkBoxStart->isChecked()));
    if (ui->checkBoxStart->isChecked())
    {
        ui->panelPrimitiveStart->getCommand(command);
    }
    command.append(RPM::boolToString(ui->checkBoxWaitEnd->isChecked()));
    return new EventCommand(EventCommandKind::PlayAVideo, command);
}

// -------------------------------------------------------

void DialogCommandPlayAVideo::initialize(EventCommand *command)
{
    int i = 0;
    m_videoID->setId(command->valueCommandAt(i++).toInt());
    ui->widgetVideo->update();
    switch (command->valueCommandAt(i++).toInt())
    {
    case 0:
        ui->radioButtonPlay->setChecked(true);
        break;
    case 1:
        ui->radioButtonPause->setChecked(true);
        break;
    case 2:
        ui->radioButtonStop->setChecked(true);
        break;
    }
    ui->checkBoxStart->setChecked(RPM::stringToBool(command->valueCommandAt(i++)));
    if (ui->checkBoxStart->isChecked())
    {
        ui->panelPrimitiveStart->initializeCommand(command, i);
    }
    ui->checkBoxWaitEnd->setChecked(RPM::stringToBool(command->valueCommandAt(i++)));
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommandPlayAVideo::on_checkBoxStart_toggled(bool checked)
{
    ui->panelPrimitiveStart->setEnabled(checked);
    ui->labelSeconds->setEnabled(checked);
}
