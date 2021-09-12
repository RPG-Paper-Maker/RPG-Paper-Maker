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
    m_parameters(parameters)
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
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandPlayAVideo::initializePrimitives()
{

}

// -------------------------------------------------------

void DialogCommandPlayAVideo::translate()
{
    this->setWindowTitle(RPM::translate(Translations::CHANGE_WEATHER) + RPM
        ::DOT_DOT_DOT);
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
    return new EventCommand(EventCommandKind::PlayAVideo, command);
}

// -------------------------------------------------------

void DialogCommandPlayAVideo::initialize(EventCommand *command)
{

}
