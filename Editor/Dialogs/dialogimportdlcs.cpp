/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QDirIterator>
#include <QCheckBox>
#include <QLabel>
#include "dialogimportdlcs.h"
#include "ui_dialogimportdlcs.h"
#include "common.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogImportDLCs::DialogImportDLCs(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogImportDLCs)
{
    ui->setupUi(this);

    this->initialize();

    this->translate();
}

DialogImportDLCs::~DialogImportDLCs()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogImportDLCs::initialize()
{
    QString path = RPM::get()->project()->gameDatas()->dlcsDatas()->path();
    QDirIterator dirs(path, QDir::Dirs | QDir::NoDotAndDotDot);
    QCheckBox *check;
    bool empty = true;
    QString name;
    while (dirs.hasNext()) {
        dirs.next();
        name = dirs.fileName();
        check = new QCheckBox(name);
        check->setChecked(RPM::get()->project()->gameDatas()->dlcsDatas()
            ->containsDlc(name));
        connect(check, &QCheckBox::toggled, [check](bool checked) {
            if (checked)
            {
                RPM::get()->project()->gameDatas()->dlcsDatas()->addDlc(check
                    ->text());
            } else
            {
                RPM::get()->project()->gameDatas()->dlcsDatas()->deleteDlc(
                    check->text());
            }
        });
        ui->verticalLayout->addWidget(check);
        empty = false;
    }
    if (empty)
    {
        ui->verticalLayout->addWidget(new QLabel("No DLC available" + RPM::DOT));
    }
    this->adjustSize();
}

// -------------------------------------------------------

void DialogImportDLCs::translate()
{
    this->setWindowTitle(RPM::translate(Translations::IMPORT_DLC_S) + RPM
        ::DOT_DOT_DOT);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}
