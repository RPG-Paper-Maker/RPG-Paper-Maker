/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "dialogcommandstopsong.h"
#include "ui_dialogcommandstopsong.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandStopSong::DialogCommandStopSong(QString title, SongKind kind,
                                             EventCommand *command,
                                             SystemCommonObject *object,
                                             QStandardItemModel *parameters,
                                             QWidget *parent) :
    DialogCommand(parent),
    m_kind(kind),
    ui(new Ui::DialogCommandStopSong)
{
    ui->setupUi(this);
    
    this->setWindowTitle(title);
    ui->panelPrimitiveValueSeconds->initializeNumber(parameters, nullptr);

    if (command != nullptr) initialize(command);
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

void DialogCommandStopSong::initialize(EventCommand* command) {
    int i = 0;

    ui->panelPrimitiveValueSeconds->initializeCommand(command, i);
}

// -------------------------------------------------------

EventCommand* DialogCommandStopSong::getCommand() const {
    QVector<QString> command;
    ui->panelPrimitiveValueSeconds->getCommand(command);

    return new EventCommand(getCommandKind(), command);
}
