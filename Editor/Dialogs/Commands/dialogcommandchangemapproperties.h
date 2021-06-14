/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDCHANGEMAPPROPERTIES_H
#define DIALOGCOMMANDCHANGEMAPPROPERTIES_H

#include "dialogcommand.h"

namespace Ui {
class DialogCommandChangeMapProperties;
}

class DialogCommandChangeMapProperties : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandChangeMapProperties(EventCommand *command = nullptr,
        QStandardItemModel *properties = nullptr, QStandardItemModel *parameters
        = nullptr, QWidget *parent = nullptr);
    virtual ~DialogCommandChangeMapProperties();

    void initializePrimitives();
    void translate();

    virtual EventCommand * getCommand() const;
    virtual void initialize(EventCommand *command);

private:
    Ui::DialogCommandChangeMapProperties *ui;
    QStandardItemModel *m_properties;
    QStandardItemModel *m_parameters;
};

#endif // DIALOGCOMMANDCHANGEMAPPROPERTIES_H
