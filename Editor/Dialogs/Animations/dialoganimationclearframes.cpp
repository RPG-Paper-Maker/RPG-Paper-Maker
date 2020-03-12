/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialoganimationclearframes.h"
#include "ui_dialoganimationclearframes.h"
#include "systemanimationframe.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogAnimationClearFrames::DialogAnimationClearFrames(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogAnimationClearFrames)
{
    ui->setupUi(this);

    this->translate();
}

DialogAnimationClearFrames::~DialogAnimationClearFrames() {
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogAnimationClearFrames::clearFrames(SystemAnimation *animation) {
    SystemAnimationFrame *frame;
    QStandardItem *item;
    int i, from, to;

    from = ui->spinBoxFrom->value();
    to = ui->spinBoxTo->value();
    for (i = from; i <= to; i++) {
        item = SuperListItem::getItemByID(animation->framesModel()
            ->invisibleRootItem(), i , false);
        if (item != nullptr) {
            frame = reinterpret_cast<SystemAnimationFrame *>(item->data().value<
                quintptr>());
            frame->clear();
            item->setText(frame->toString());
        }
    }
}

//-------------------------------------------------

void DialogAnimationClearFrames::translate()
{
    this->setWindowTitle(RPM::translate(Translations::CLEAR_FRAMES) + RPM
        ::DOT_DOT_DOT);
    ui->labelTo->setText(RPM::translate(Translations::TO) + RPM::COLON);
    ui->labelFrom->setText(RPM::translate(Translations::FROM) + RPM::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}
