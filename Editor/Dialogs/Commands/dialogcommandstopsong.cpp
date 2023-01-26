/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandstopsong.h"
#include "ui_dialogcommandstopsong.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandStopSong::DialogCommandStopSong(QString title, SongKind kind,
    EventCommand *command, QStandardItemModel *properties, QStandardItemModel
    *parameters, QWidget *parent) :
    DialogCommand(parent),
    m_kind(kind),
    m_properties(properties),
    m_parameters(parameters),
    ui(new Ui::DialogCommandStopSong)
{
    ui->setupUi(this);

    if (kind == SongKind::Sound)
    {
        ui->panelPrimitiveSoundID->initializeNumber(parameters, properties);
    } else {
        ui->labelSoundID->hide();
        ui->panelPrimitiveSoundID->hide();
        ui->horizontalSpacer->changeSize(0, 0);
    }
    
    this->setWindowTitle(title);
    ui->panelPrimitiveValueSeconds->initializeNumber(parameters, properties);

    if (command != nullptr) initialize(command);

    this->translate();
}

DialogCommandStopSong::~DialogCommandStopSong()
{
    delete ui;
}

EventCommandKind DialogCommandStopSong::getCommandKind() const {
    switch(m_kind) {
    case SongKind::Music:
        return EventCommandKind::StopMusic;
    case SongKind::BackgroundSound:
        return EventCommandKind::StopBackgroundSound;
    case SongKind::Sound:
        return EventCommandKind::StopASound;
    default:
        break;
    }

    return EventCommandKind::None;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

//-------------------------------------------------

void DialogCommandStopSong::translate()
{
    ui->labelSoundID->setText(RPM::translate(Translations::SOUND_ID) + RPM::COLON);
    ui->labelDisappearWithTime->setText(RPM::translate(Translations
        ::DISAPPEAR_WITH_TIME) + RPM::COLON);
    ui->labelSeconds->setText(RPM::translate(Translations::SECONDS));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------

void DialogCommandStopSong::initialize(EventCommand* command) {
    int i = 0;

    ui->panelPrimitiveValueSeconds->initializeCommand(command, i);
    if (m_kind == SongKind::Sound)
    {
        ui->panelPrimitiveSoundID->initializeCommand(command, i);
    }
}

// -------------------------------------------------------

EventCommand* DialogCommandStopSong::getCommand() const {
    QVector<QString> command;
    ui->panelPrimitiveValueSeconds->getCommand(command);
    if (m_kind == SongKind::Sound)
    {
        ui->panelPrimitiveSoundID->getCommand(command);
    }

    return new EventCommand(getCommandKind(), command);
}
