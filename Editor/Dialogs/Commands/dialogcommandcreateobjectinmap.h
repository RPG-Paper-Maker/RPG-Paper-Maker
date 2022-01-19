/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDCREATEOBJECTINMAP_H
#define DIALOGCOMMANDCREATEOBJECTINMAP_H

#include "dialogcommand.h"

namespace Ui {
class DialogCommandCreateObjectInMap;
}

class DialogCommandCreateObjectInMap : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandCreateObjectInMap(EventCommand *command = nullptr,
        QStandardItemModel *properties = nullptr, QStandardItemModel *parameters
        = nullptr, QWidget *parent = nullptr);
    ~DialogCommandCreateObjectInMap();

    void translate();
    void initializePrimitives();

    virtual EventCommand * getCommand() const;
    virtual void initialize(EventCommand* command);

private:
    Ui::DialogCommandCreateObjectInMap *ui;
    QStandardItemModel *m_properties;
    QStandardItemModel *m_parameters;

public slots:
    void on_checkBoxStock_toggled(bool checked);
};

#endif // DIALOGCOMMANDCREATEOBJECTINMAP_H
