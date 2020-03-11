/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemobjectevent.h"
#include "ui_dialogsystemobjectevent.h"
#include "rpm.h"

DialogSystemObjectEvent::DialogSystemObjectEvent(SystemObjectEvent &event,
                                                 QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemObjectEvent),
    m_event(event)
{
    ui->setupUi(this);
    
    initialize();

    this->translate();
}

DialogSystemObjectEvent::~DialogSystemObjectEvent()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemObjectEvent::initialize(){
    ui->widget->initialize(&m_event);
}

//-------------------------------------------------

void DialogSystemObjectEvent::translate()
{
    this->setWindowTitle(RPM::translate(Translations::NEW_PROJECT));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}
